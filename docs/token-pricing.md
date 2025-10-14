# Token 价格计算逻辑

## 概述

本系统使用 `SUPPORTED_MODELS` 配置和 tiktoken 库来准确计算聊天对话的 token 消耗和相应的积分扣除。

## 支持的模型

系统支持以下模型及其价格：

| 模型                      | 名称             | 输入价格 ($/1K tokens) | 输出价格 ($/1K tokens) |
| ------------------------- | ---------------- | ---------------------- | ---------------------- |
| `openai/gpt-4o-mini`      | GPT-4o Mini      | $0.00000015            | $0.0000006             |
| `openai/gpt-4o`           | GPT-4o           | $0.0000025             | $0.00001               |
| `google/gemini-2.5-flash` | Gemini 2.5 Flash | $0.0000003             | $0.0000025             |
| `google/gemini-2.5-pro`   | Gemini 2.5 Pro   | $0.00000125            | $0.00001               |

## 价格计算逻辑

### 1. Token 估算

使用 tiktoken 库根据模型类型进行准确的 token 计数：

- **GPT-4 系列**: 使用 `gpt-4` 编码器
- **GPT-3.5 系列**: 使用 `gpt-3.5-turbo` 编码器
- **其他模型**: 默认使用 `gpt-3.5-turbo` 编码器

### 2. 成本计算

```typescript
const calculateCost = (model: string, inputTokens: number, outputTokens: number): number => {
  const modelInfo = SUPPORTED_MODELS[model];

  if (!modelInfo) {
    // 默认价格：每1000个token消耗1个积分
    return Math.ceil((inputTokens + outputTokens) / 1000);
  }

  const promptPrice = parseFloat(modelInfo.pricing.prompt);
  const completionPrice = parseFloat(modelInfo.pricing.completion);

  // 计算输入和输出的成本（以美元为单位）
  const inputCost = (inputTokens / 1000) * promptPrice;
  const outputCost = (outputTokens / 1000) * completionPrice;
  const totalCostUSD = inputCost + outputCost;

  // 将美元转换为积分（1积分 = $0.01）
  const CREDIT_VALUE_USD = 0.01;
  const creditsToConsume = Math.ceil(totalCostUSD / CREDIT_VALUE_USD);

  // 确保至少消耗1个积分
  return Math.max(1, creditsToConsume);
};
```

### 3. 积分转换

- **积分价值**: 1积分 = $0.01
- **最小消耗**: 每次对话至少消耗1个积分
- **向上取整**: 所有积分消耗都向上取整

## 使用示例

### 示例1: GPT-4o Mini 对话

```
输入: 1000 tokens
输出: 500 tokens
模型: openai/gpt-4o-mini

计算:
- 输入成本: (1000/1000) × $0.00000015 = $0.00000015
- 输出成本: (500/1000) × $0.0000006 = $0.0000003
- 总成本: $0.00000045
- 积分消耗: ceil($0.00000045 / $0.01) = 1积分
```

### 示例2: GPT-4o 对话

```
输入: 2000 tokens
输出: 1000 tokens
模型: openai/gpt-4o

计算:
- 输入成本: (2000/1000) × $0.0000025 = $0.000005
- 输出成本: (1000/1000) × $0.00001 = $0.00001
- 总成本: $0.000015
- 积分消耗: ceil($0.000015 / $0.01) = 1积分
```

### 示例3: 长对话 (Gemini 2.5 Pro)

```
输入: 5000 tokens
输出: 2000 tokens
模型: google/gemini-2.5-pro

计算:
- 输入成本: (5000/1000) × $0.00000125 = $0.00000625
- 输出成本: (2000/1000) × $0.00001 = $0.00002
- 总成本: $0.00002625
- 积分消耗: ceil($0.00002625 / $0.01) = 1积分
```

## 错误处理

1. **未知模型**: 如果模型不在 `SUPPORTED_MODELS` 中，使用默认价格（每1000个token消耗1个积分）
2. **tiktoken 失败**: 如果 tiktoken 库失败，降级到字符估算（1个token ≈ 4个字符）
3. **价格解析失败**: 如果价格解析失败，使用默认价格

## 日志记录

系统会记录详细的消耗信息：

```
Chat completion - openai/gpt-4o - 3000 tokens (2000 input + 1000 output) - $0.000015
```

包含：

- 使用的模型
- 总 token 数
- 输入和输出 token 数
- 实际美元成本

## 配置

价格配置在 `src/lib/tokens.ts` 中的 `SUPPORTED_MODELS` 对象中定义，可以根据需要调整：

- 添加新模型
- 更新价格
- 修改积分价值
- 调整最小消耗策略
