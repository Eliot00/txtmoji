import { TextFieldRoot, TextFieldLabel, TextField, TextFieldDescription } from "~/components/ui/textfield";
import { TextArea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Check, Copy, Lock } from "lucide-solid";
import { createSignal, Show } from "solid-js";
import { encrypt } from "~/libs/crypto";

export default function EncryptForm() {
  const [encrypted, setEncrypted] = createSignal<string | null>(null)
  const [copied, setCopied] = createSignal(false)

  const copyToClipboard = async () => {
    if (encrypted()) {
      await navigator.clipboard.writeText(encrypted()!)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <form
        class="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          const plaintext = formData.get("plaintext")
          const password = formData.get("password")
          if (plaintext) {
            const encrypted = await encrypt(plaintext.toString(), password?.toString())
            setEncrypted(encrypted)
          }
        }}
      >
        <TextFieldRoot name="plaintext" required>
          <TextFieldLabel>1. 要加密的文本</TextFieldLabel>
          <TextArea placeholder="请输入" />
        </TextFieldRoot>
        <TextFieldRoot name="password">
          <TextFieldLabel>2. 设置密钥</TextFieldLabel>
          <TextField placeholder="如：1234" type="password" />
          <TextFieldDescription>选填，解密时必须使用相同的密钥。</TextFieldDescription>
        </TextFieldRoot>
        <div>
          <label class="text-sm font-medium block mb-2">3. 加密</label>
          <Button type="submit" class="w-full">
            <Lock class="mr-2 h-4 w-4" /> 加密
          </Button>
        </div>
      </form>
      <Show when={!!encrypted()}>
        <div class="relative mt-2">
        <pre class="animate-in fade-in zoom-in bg-zinc-100 rounded-md p-2 overflow-x-scroll">
          <code>{encrypted()}</code>
        </pre>
          <button
            class="absolute right-2 top-2 bg-white border rounded p-1 hover:bg-gray-200"
            onClick={copyToClipboard}
          >
            <Show when={copied()} fallback={<Copy class="h-4 w-4" />}>
              <Check class="h-4 w-4" />
            </Show>
          </button>
        </div>
      </Show>
    </>
  )
}
