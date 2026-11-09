#!/usr/bin/env swift
/**
 * synthux — Apple Foundation Models (macOS 26 / macOS 27+) Local Bridge
 *
 * Interfaces directly with Apple's native `FoundationModels` framework:
 *   - `SystemLanguageModel.default` (On-Device Apple Silicon Neural Engine model)
 *   - `SystemLanguageModel(useCase: .contentTagging)` (Fast structured tagging)
 *   - `PrivateCloudComputeLanguageModel()` (macOS 27+ Apple Private Cloud Compute)
 *
 * Commands:
 *   1. `synthux-apple-fm status`
 *      Outputs JSON with availability, macOS version, context window size, and models.
 *   2. `synthux-apple-fm generate`
 *      Reads JSON payload from stdin:
 *        { "model": "apple-on-device", "prompt": "...", "system": "...", "temperature": 0.3, "maxTokens": 2048 }
 *      Outputs JSON response to stdout:
 *        { "success": true, "model": "apple-on-device", "response": "{...}", "inputTokens": 0, "outputTokens": 0 }
 */

import Foundation
#if canImport(FoundationModels)
import FoundationModels
#endif

struct BridgeRequest: Decodable {
    let model: String?
    let prompt: String
    let system: String?
    let temperature: Double?
    let maxTokens: Int?
}

func jsonOut(_ dict: [String: Any]) {
    if let data = try? JSONSerialization.data(withJSONObject: dict, options: []),
       let str = String(data: data, encoding: .utf8) {
        FileHandle.standardOutput.write((str + "\n").data(using: .utf8)!)
    }
}

func cleanJsonResponse(_ text: String) -> String {
    var trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
    if trimmed.hasPrefix("```json") {
        trimmed = String(trimmed.dropFirst(7))
    } else if trimmed.hasPrefix("```") {
        trimmed = String(trimmed.dropFirst(3))
    }
    if trimmed.hasSuffix("```") {
        trimmed = String(trimmed.dropLast(3))
    }
    return trimmed.trimmingCharacters(in: .whitespacesAndNewlines)
}

func osVersionString() -> String {
    let v = ProcessInfo.processInfo.operatingSystemVersion
    return "macOS \(v.majorVersion).\(v.minorVersion).\(v.patchVersion)"
}

struct SynthuxAppleFMBridge {
    static func run() async {
        let args = CommandLine.arguments
        let command = args.count > 1 ? args[1] : "status"

        #if canImport(FoundationModels)
        if #available(macOS 26.0, *) {
            if command == "status" {
                await handleStatus()
                return
            } else if command == "generate" {
                await handleGenerate()
                return
            }
        }
        #endif

        jsonOut([
            "available": false,
            "status": "unsupported_os",
            "reason": "Apple FoundationModels framework requires macOS 26.0 or newer (macOS 27 recommended).",
            "osVersion": osVersionString(),
            "models": []
        ])
    }

    #if canImport(FoundationModels)
    @available(macOS 26.0, *)
    static func handleStatus() async {
        let defaultModel = SystemLanguageModel.default
        var statusStr = "connected"
        var reasonStr: String? = nil
        var isAvailable = false

        switch defaultModel.availability {
        case .available:
            isAvailable = true
            statusStr = "connected"
        case .unavailable(let reason):
            isAvailable = false
            switch reason {
            case .deviceNotEligible:
                statusStr = "device_not_eligible"
                reasonStr = "This Mac is not eligible for Apple Intelligence (Apple Silicon M1 or newer required)."
            case .appleIntelligenceNotEnabled:
                statusStr = "apple_intelligence_disabled"
                reasonStr = "Apple Intelligence is disabled. Enable it in System Settings → Apple Intelligence & Siri."
            case .modelNotReady:
                statusStr = "model_not_ready"
                reasonStr = "Apple Foundation Model is still preparing or downloading in macOS System Settings."
            @unknown default:
                statusStr = "unavailable"
                reasonStr = "Apple Foundation Model is currently unavailable."
            }
        }

        var contextSize = 4096
        var variantName = "Apple On-Device Foundation Model"
        var pccAvailable = false

        if #available(macOS 27.0, *) {
            if defaultModel.contextSize > 0 {
                contextSize = defaultModel.contextSize
            }
            variantName = defaultModel.variant.displayName
            let pccModel = PrivateCloudComputeLanguageModel()
            pccAvailable = pccModel.isAvailable
        }

        var models: [[String: Any]] = [
            [
                "id": "apple-on-device",
                "name": "Apple Foundation Model (On-Device ANE)",
                "size": 0
            ],
            [
                "id": "apple-content-tagging",
                "name": "Apple Foundation Model (Fast Tagging)",
                "size": 0
            ]
        ]

        if #available(macOS 27.0, *) {
            models.insert([
                "id": "apple-pcc",
                "name": "Apple Private Cloud Compute (macOS 27)",
                "size": 0
            ], at: 1)
        }

        jsonOut([
            "available": isAvailable,
            "status": statusStr,
            "reason": reasonStr as Any,
            "osVersion": osVersionString(),
            "contextSize": contextSize,
            "variant": variantName,
            "pccAvailable": pccAvailable,
            "models": models
        ])
    }

    @available(macOS 26.0, *)
    static func handleGenerate() async {
        let inputData = FileHandle.standardInput.readDataToEndOfFile()
        guard !inputData.isEmpty,
              let req = try? JSONDecoder().decode(BridgeRequest.self, from: inputData) else {
            jsonOut([
                "success": false,
                "error": "Invalid JSON input payload for Apple Foundation Model bridge."
            ])
            return
        }

        let startTime = Date()
        let requestedModel = req.model ?? "apple-on-device"
        let temperature = req.temperature ?? 0.3
        let maxTokens = req.maxTokens ?? 2048
        let options = GenerationOptions(
            temperature: temperature,
            maximumResponseTokens: maxTokens
        )

        // Trim prompt safely if it exceeds on-device context budget (~12,000 chars ≈ 3,000 tokens)
        let maxPromptChars = requestedModel == "apple-pcc" ? 28000 : 12000
        let safePrompt: String
        if req.prompt.count > maxPromptChars {
            safePrompt = String(req.prompt.prefix(maxPromptChars)) + "\n\n[DOM truncated to fit on-device context window. Respond ONLY with valid JSON.]"
        } else {
            safePrompt = req.prompt
        }

        do {
            var responseText = ""
            var inputTokens = max(1, safePrompt.count / 4)
            var outputTokens = 0

            if #available(macOS 27.0, *), requestedModel == "apple-pcc" {
                let pccModel = PrivateCloudComputeLanguageModel()
                if pccModel.isAvailable {
                    let session = LanguageModelSession(
                        model: pccModel,
                        instructions: req.system
                    )
                    let res = try await session.respond(to: safePrompt, options: options)
                    responseText = cleanJsonResponse(res.content)
                    inputTokens = res.usage.input.totalTokenCount
                    outputTokens = res.usage.output.totalTokenCount
                } else {
                    // Fallback to on-device model if PCC is not ready
                    let onDevice = SystemLanguageModel(
                        useCase: .general,
                        guardrails: .permissiveContentTransformations
                    )
                    let session = LanguageModelSession(
                        model: onDevice,
                        instructions: req.system
                    )
                    let res = try await session.respond(to: safePrompt, options: options)
                    responseText = cleanJsonResponse(res.content)
                    inputTokens = res.usage.input.totalTokenCount
                    outputTokens = res.usage.output.totalTokenCount
                }
            } else {
                let useCase: SystemLanguageModel.UseCase = (requestedModel == "apple-content-tagging")
                    ? .contentTagging
                    : .general
                let onDevice = SystemLanguageModel(
                    useCase: useCase,
                    guardrails: .permissiveContentTransformations
                )

                guard onDevice.isAvailable else {
                    jsonOut([
                        "success": false,
                        "error": "Apple Foundation Model is not available on this Mac (\(onDevice.availability)). Make sure Apple Intelligence is enabled in System Settings."
                    ])
                    return
                }

                let session = LanguageModelSession(
                    model: onDevice,
                    instructions: req.system
                )
                let res = try await session.respond(to: safePrompt, options: options)
                responseText = cleanJsonResponse(res.content)
                if #available(macOS 27.0, *) {
                    inputTokens = res.usage.input.totalTokenCount
                    outputTokens = res.usage.output.totalTokenCount
                } else {
                    outputTokens = max(1, responseText.count / 4)
                }
            }

            let elapsedNs = Int64(Date().timeIntervalSince(startTime) * 1_000_000_000)

            jsonOut([
                "success": true,
                "model": requestedModel,
                "response": responseText,
                "inputTokens": inputTokens,
                "outputTokens": outputTokens,
                "totalDuration": elapsedNs
            ])
        } catch {
            jsonOut([
                "success": false,
                "error": "Apple Foundation Model error: \(error.localizedDescription)"
            ])
        }
    }
    #endif
}

Task {
    await SynthuxAppleFMBridge.run()
    exit(0)
}
RunLoop.main.run()

