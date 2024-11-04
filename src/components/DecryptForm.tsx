import { TextFieldRoot, TextFieldLabel, TextField } from "~/components/ui/textfield";
import { TextArea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Check, Copy, Unlock } from "lucide-solid";
import { createSignal, Show } from "solid-js";
import { decrypt } from "~/libs/crypto";

export default function DecryptForm() {
  const [decrypted, setDecrypted] = createSignal<string | null>(null)
  const [copied, setCopied] = createSignal(false)

  const copyToClipboard = async () => {
    if (decrypted()) {
      await navigator.clipboard.writeText(decrypted()!)
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
          const encrypted = formData.get("encrypted")
          const password = formData.get("password")
          if (encrypted) {
            const decrypted = await decrypt(encrypted.toString(), password?.toString())
            setDecrypted(decrypted)
          }
        }}
      >
        <TextFieldRoot name="encrypted" required>
          <TextFieldLabel>1. 加密后的文本</TextFieldLabel>
          <TextArea placeholder="请输入" />
        </TextFieldRoot>
        <TextFieldRoot name="password">
          <TextFieldLabel>2. 密钥</TextFieldLabel>
          <TextField placeholder="如：1234" type="password" />
        </TextFieldRoot>
        <div>
          <label class="text-sm font-medium block mb-2">3. 解密</label>
          <Button type="submit" class="w-full">
            <Unlock class="mr-2 h-4 w-4" /> 解密
          </Button>
        </div>
      </form>
      <Show when={!!decrypted()}>
        <div class="relative mt-2">
        <pre class="animate-in fade-in zoom-in bg-zinc-100 rounded-md p-2 overflow-x-scroll">
          <code>{decrypted()}</code>
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
