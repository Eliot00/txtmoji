import { TextFieldRoot, TextFieldLabel, TextField } from "~/components/ui/textfield";
import { TextArea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Lock } from "lucide-solid";
import { createSignal, Show } from "solid-js";

export default function EncryptForm() {
  const [ciphertext, setCiphertext] = createSignal<string | null>(null)

  return (
    <>
      <form
        class="space-y-4"
        onSubmit={e => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          const plaintext = formData.get("plaintext")
          if (plaintext) {
            setCiphertext(plaintext.toString())
          }
        }}
      >
        <TextFieldRoot name="plaintext" required>
          <TextFieldLabel>1. 要加密的文本</TextFieldLabel>
          <TextArea placeholder="请输入" />
        </TextFieldRoot>
        <TextFieldRoot name="key">
          <TextFieldLabel>2. 设置密钥</TextFieldLabel>
          <TextField placeholder="如：1234" />
        </TextFieldRoot>
        <div>
          <label class="text-sm font-medium block mb-2">3. 加密</label>
          <Button type="submit" class="w-full">
            <Lock class="mr-2 h-4 w-4" /> 加密
          </Button>
        </div>
      </form>
      <Show when={!!ciphertext()}>
        <pre>
          <code>{ciphertext()}</code>
        </pre>
      </Show>
    </>
  )
}
