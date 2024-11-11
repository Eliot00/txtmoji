import { createSignal } from "solid-js";
import DecryptForm from "~/components/DecryptForm";
import EncryptForm from "~/components/EncryptForm";
import { Codeberg, Github } from "~/components/icons";
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function Home() {
  const [selectedTab, setSelectedTab] = createSignal("encrypt")
  return (
    <main class="h-screen max-w-lg flex flex-col items-center gap-8 mx-auto bg-background text-foreground py-20">
      <h1 class="font-bold text-5xl">
        文本 <span classList={{ 'rotate-180': selectedTab() === 'decrypt' }} class="mx-2 inline-block transition-transform duration-500">→</span> 😀
      </h1>
      <Tabs value={selectedTab()} onChange={setSelectedTab} class="w-full">
        <TabsList>
          <TabsTrigger value="encrypt">加密</TabsTrigger>
          <TabsTrigger value="decrypt">解密</TabsTrigger>
          <TabsIndicator />
        </TabsList>
        <TabsContent value="encrypt">
          <EncryptForm />
        </TabsContent>
        <TabsContent value="decrypt">
          <DecryptForm />
        </TabsContent>
      </Tabs>
      <footer class="mt-auto flex items-center justify-center gap-2">
        <span class="flex items-center gap-2">
          <a href="https://github.com/Eliot00/txtmoji" target="_blank" rel="noopener noreferrer">
            <Github />
          </a>
          <a href="https://codeberg.org/Elliot00/txtmoji" target="_blank" rel="noopener noreferrer">
            <Codeberg />
          </a>
        </span>
        <div class="w-0.5 h-4 bg-zinc-400" />
        <span>
          <a href="https://elliot00.com" target="_blank" rel="noopener noreferrer" class="underline">
            Elliot
          </a>
          作
        </span>
      </footer>
    </main>
  );
}
