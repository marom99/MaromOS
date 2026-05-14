import { WindowFrame } from "@/components/layout/WindowFrame";
import { ControlPanelsMenuBar } from "./ControlPanelsMenuBar";
import { HelpDialog } from "@/components/dialogs/HelpDialog";
import { AboutDialog } from "@/components/dialogs/AboutDialog";
import { appMetadata } from "..";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs } from "@/components/ui/tabs";
import {
  ThemedTabsList,
  ThemedTabsTrigger,
  ThemedTabsContent,
} from "@/components/shared/ThemedTabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WallpaperPicker } from "./WallpaperPicker";
import { ScreenSaverPicker } from "./ScreenSaverPicker";
import { AppProps, ControlPanelsInitialData } from "@/apps/base/types";
import { SYNTH_PRESETS } from "@/hooks/useChatSynth";
import { VolumeMixer } from "./VolumeMixer";
import { enabledThemeIds, themes } from "@/themes";
import { OsThemeId } from "@/themes/types";
import type { LanguageCode } from "@/stores/useLanguageStore";
import { useControlPanelsLogic } from "../hooks/useControlPanelsLogic";



export function ControlPanelsAppComponent({
  isWindowOpen,
  onClose,
  isForeground,
  skipInitialSound,
  initialData,
  instanceId,
  onNavigateNext,
  onNavigatePrevious,
}: AppProps<ControlPanelsInitialData>) {
  const {
    t,
    translatedHelpItems,
    windowTitle,
    defaultTab,
    isHelpDialogOpen,
    setIsHelpDialogOpen,
    isAboutDialogOpen,
    setIsAboutDialogOpen,
    currentTheme,
    setTheme,
    currentLanguage,
    setLanguage,
    tabStyles,
    isXpTheme,
    isMacOSXTheme,
    isClassicMacTheme,
    isWindowsLegacyTheme,
    uiSoundsEnabled,
    handleUISoundsChange,
    speechEnabled,
    handleSpeechChange,
    terminalSoundsEnabled,
    setTerminalSoundsEnabled,
    synthPreset,
    handleSynthPresetChange,
    masterVolume,
    setMasterVolume,
    setPrevMasterVolume,
    handleMasterMuteToggle,
    uiVolume,
    setUiVolume,
    setPrevUiVolume,
    handleUiMuteToggle,
    speechVolume,
    setSpeechVolume,
    setPrevSpeechVolume,
    handleSpeechMuteToggle,
    chatSynthVolume,
    setChatSynthVolume,
    setPrevChatSynthVolume,
    handleChatSynthMuteToggle,
    ipodVolume,
    setIpodVolume,
    setPrevIpodVolume,
    handleIpodMuteToggle,
    isIOS,
  } = useControlPanelsLogic({ initialData });

  const menuBar = (
    <ControlPanelsMenuBar
      onClose={onClose}
      onShowHelp={() => setIsHelpDialogOpen(true)}
      onShowAbout={() => setIsAboutDialogOpen(true)}
    />
  );

  if (!isWindowOpen) return null;

  return (
    <>
      {!isXpTheme && isForeground && menuBar}
      <WindowFrame
        title={windowTitle}
        onClose={onClose}
        isForeground={isForeground}
        appId="control-panels"
        skipInitialSound={skipInitialSound}
        instanceId={instanceId}
        onNavigateNext={onNavigateNext}
        onNavigatePrevious={onNavigatePrevious}
        menuBar={isXpTheme ? menuBar : undefined}
      >
        <div
          className={`flex flex-col h-full w-full ${
            isWindowsLegacyTheme ? "pt-0 pb-2 px-2" : ""
          } ${
            isClassicMacTheme
              ? isMacOSXTheme
                ? "p-4 pt-2"
                : "p-4 bg-[#E3E3E3]"
              : ""
          }`}
        >
          <Tabs defaultValue={defaultTab} className="w-full h-full">
            <ThemedTabsList>
              <ThemedTabsTrigger value="appearance">
                {t("apps.control-panels.appearance")}
              </ThemedTabsTrigger>
              <ThemedTabsTrigger value="sound">
                {t("apps.control-panels.sound")}
              </ThemedTabsTrigger>
            </ThemedTabsList>

            <ThemedTabsContent value="appearance">
              <div className="space-y-4 h-full overflow-y-auto p-4 pt-6">
                {/* Theme Selector */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <Label>{t("apps.control-panels.theme")}</Label>
                    <Label className="text-[11px] text-neutral-600 font-geneva-12">
                      {t("apps.control-panels.themeDescription")}
                    </Label>
                  </div>
                  <Select
                    value={currentTheme}
                    onValueChange={(value) => setTheme(value as OsThemeId)}
                  >
                    <SelectTrigger className="w-[120px] flex-shrink-0">
                      <SelectValue placeholder={t("apps.control-panels.select")}>
                        {themes[currentTheme]?.name ||
                          t("apps.control-panels.select")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {enabledThemeIds.map((id) => {
                        const theme = themes[id];
                        return (
                          <SelectItem key={id} value={id}>
                            {theme.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Language Selector */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <Label>{t("settings.language.title")}</Label>
                    <Label className="text-[11px] text-neutral-600 font-geneva-12">
                      {t("settings.language.description")}
                    </Label>
                  </div>
                  <Select
                    value={currentLanguage}
                    onValueChange={(value) =>
                      setLanguage(value as LanguageCode)
                    }
                  >
                    <SelectTrigger className="w-[120px] flex-shrink-0">
                      <SelectValue>
                        {t(`settings.language.${
                          currentLanguage === "zh-TW"
                            ? "chineseTraditional"
                            : currentLanguage === "ja"
                            ? "japanese"
                            : currentLanguage === "ko"
                            ? "korean"
                            : currentLanguage === "es"
                            ? "spanish"
                            : currentLanguage === "fr"
                            ? "french"
                            : currentLanguage === "de"
                            ? "german"
                            : currentLanguage === "pt"
                            ? "portuguese"
                            : currentLanguage === "it"
                            ? "italian"
                            : currentLanguage === "ru"
                            ? "russian"
                            : "english"
                        }`)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">
                        {t("settings.language.english")}
                      </SelectItem>
                      <SelectItem value="zh-TW">
                        {t("settings.language.chineseTraditional")}
                      </SelectItem>
                      <SelectItem value="ja">
                        {t("settings.language.japanese")}
                      </SelectItem>
                      <SelectItem value="ko">
                        {t("settings.language.korean")}
                      </SelectItem>
                      <SelectItem value="es">
                        {t("settings.language.spanish")}
                      </SelectItem>
                      <SelectItem value="fr">
                        {t("settings.language.french")}
                      </SelectItem>
                      <SelectItem value="de">
                        {t("settings.language.german")}
                      </SelectItem>
                      <SelectItem value="pt">
                        {t("settings.language.portuguese")}
                      </SelectItem>
                      <SelectItem value="it">
                        {t("settings.language.italian")}
                      </SelectItem>
                      <SelectItem value="ru">
                        {t("settings.language.russian")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <ScreenSaverPicker />

                <div
                  className="border-t my-4"
                  style={tabStyles.separatorStyle}
                />

                <WallpaperPicker />
              </div>
            </ThemedTabsContent>

            <ThemedTabsContent value="sound">
              <div className="space-y-4 h-full overflow-y-auto p-4 pt-6">
                {/* UI Sounds toggle + volume */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <Label>{t("apps.control-panels.uiSounds")}</Label>
                    <Switch
                      checked={uiSoundsEnabled}
                      onCheckedChange={handleUISoundsChange}
                      className="data-[state=checked]:bg-[#000000]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <Label>{t("apps.control-panels.speech")}</Label>
                    <Switch
                      checked={speechEnabled}
                      onCheckedChange={handleSpeechChange}
                      className="data-[state=checked]:bg-[#000000]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <Label>{t("apps.control-panels.terminalIeAmbientSynth")}</Label>
                  </div>
                  <Switch
                    checked={terminalSoundsEnabled}
                    onCheckedChange={setTerminalSoundsEnabled}
                    className="data-[state=checked]:bg-[#000000]"
                  />
                </div>

                {/* Chat Synth preset */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <Label>{t("apps.control-panels.chatSynth")}</Label>
                    <Select
                      value={synthPreset}
                      onValueChange={handleSynthPresetChange}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue
                          placeholder={t("apps.control-panels.selectAPreset")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(SYNTH_PRESETS).map(([key, preset]) => (
                          <SelectItem key={key} value={key}>
                            {preset.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Volume controls separator */}
                <hr
                  className="my-3 border-t"
                  style={tabStyles.separatorStyle}
                />

                {/* Vertical Volume Sliders - Mixer UI */}
                <VolumeMixer
                  masterVolume={masterVolume}
                  setMasterVolume={setMasterVolume}
                  setPrevMasterVolume={setPrevMasterVolume}
                  handleMasterMuteToggle={handleMasterMuteToggle}
                  uiVolume={uiVolume}
                  setUiVolume={setUiVolume}
                  setPrevUiVolume={setPrevUiVolume}
                  handleUiMuteToggle={handleUiMuteToggle}
                  speechVolume={speechVolume}
                  setSpeechVolume={setSpeechVolume}
                  setPrevSpeechVolume={setPrevSpeechVolume}
                  handleSpeechMuteToggle={handleSpeechMuteToggle}
                  chatSynthVolume={chatSynthVolume}
                  setChatSynthVolume={setChatSynthVolume}
                  setPrevChatSynthVolume={setPrevChatSynthVolume}
                  handleChatSynthMuteToggle={handleChatSynthMuteToggle}
                  ipodVolume={ipodVolume}
                  setIpodVolume={setIpodVolume}
                  setPrevIpodVolume={setPrevIpodVolume}
                  handleIpodMuteToggle={handleIpodMuteToggle}
                  isIOS={isIOS}
                />
              </div>
            </ThemedTabsContent>

          </Tabs>
        </div>

        <HelpDialog
          isOpen={isHelpDialogOpen}
          onOpenChange={setIsHelpDialogOpen}
          helpItems={translatedHelpItems}
          appId="control-panels"
        />
        <AboutDialog
          isOpen={isAboutDialogOpen}
          onOpenChange={setIsAboutDialogOpen}
          metadata={appMetadata}
          appId="control-panels"
        />
      </WindowFrame>
    </>
  );
}
