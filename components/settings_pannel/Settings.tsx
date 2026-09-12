"use client";

import { ChangeEvent } from "react";
import type { LogoSettings } from "../LogoGenerator";

interface SettingsProps {
  settings: LogoSettings;
  onChange: React.Dispatch<React.SetStateAction<LogoSettings>>;
}

export default function Settings({ settings, onChange }: SettingsProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    onChange((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "range" || type === "number"
            ? Number(value)
            : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange((prev) => ({ ...prev, logoFile: file }));
  };

  return (
    <div className="pannel bg-darkgrey rounded-xl p-6 border border-half-darkgrey">
      <h1
        style={{
          fontSize: "1.4rem",
          fontWeight: 900,
          marginBottom: "0.5rem",
          color: "#fff",
          display: "inline-block",
        }}
      >
        Antifascist Logo Generator
      </h1>
      <p
        style={{
          fontSize: "0.85rem",
          color: "#888",
          marginBottom: "1.25rem",
        }}
      >
        Antifascist Logo Generator - create your own custom SVG with text on an
        arc, a central image, and adjustable layout.
      </p>
      <details className="about">
        <summary>
          Why this logo matters - history of the Antifa symbol &amp; fighting
          fascism today
        </summary>

        <p>
          The <strong>Antifa logo</strong> originates from the
          <a
            href="https://en.wikipedia.org/wiki/Antifaschistische_Aktion"
            target="_blank"
            rel="noopener"
          >
            <strong>Antifaschistische Aktion</strong>
          </a>
          (Antifascist Action), a united front formed by the Communist Party of
          Germany (KPD) in 1932 to resist the rising Nazi movement. Its two
          flags - one red, one black - represent the unity of communists and
          anarchists/social democrats against a common enemy. The original
          design was created by
          <a
            href="https://de.wikipedia.org/wiki/Max_Gebhard_(Grafiker)"
            target="_blank"
            rel="noopener"
          >
            <strong> Max Gebhard</strong>
          </a>
          , a German graphic artist and KPD member. After World War II, the
          symbol was revived by the
          <a
            href="https://en.wikipedia.org/wiki/Autonomism#German_and_French_autonomist_movements_:_generalization_to_Western_Europe_(late_1970s-1989)"
            target="_blank"
            rel="noopener"
          >
            <strong> Autonomen </strong>
          </a>
          movement in West Germany during the 1970s and 80s, and later adopted
          globally by <strong>anti-fascist organizers</strong> as a general
          symbol of resistance (
          <a
            href="https://en.wikipedia.org/wiki/Antifa_(Germany)"
            target="_blank"
            rel="noopener"
          >
            source: Wikipedia - Antifa (Germany)
          </a>
          ).
        </p>

        <p>
          <strong>Why fight fascism today ?</strong> Fascism is not a relic of
          the 20th century - it adapts and resurfaces wherever democratic
          institutions weaken. In the 2020s, far-right parties and movements
          have gained ground across Europe, the Americas, and beyond. According
          to
          <a href="https://www.amnesty.org/en/" target="_blank" rel="noopener">
            <strong> Amnesty International </strong>
          </a>
          , hate crimes and far-right violence have risen sharply in multiple
          countries (
          <a
            href="https://www.amnesty.org/en/what-we-do/discrimination/hate-crime/"
            target="_blank"
            rel="noopener"
          >
            Amnesty - Hate Crime
          </a>
          ). Organizations like
          <a href="https://hopenothate.org.uk/" target="_blank" rel="noopener">
            <strong> Hope Not Hate </strong>
          </a>
          track the spread of far-right extremism and its real-world
          consequences. The <strong>United Nations</strong> has repeatedly
          warned about the resurgence of neo-Nazi and white supremacist
          ideologies worldwide (
          <a
            href="https://digitallibrary.un.org/record/3827500?ln=fr"
            target="_blank"
            rel="noopener"
          >
            UN - Contemporary Forms of Racism
          </a>
          ).
        </p>

        <p>
          Using an <strong>Antifascist Logo Generator</strong> is a small but
          visible way to show solidarity. Whether you&apos;re printing stickers,
          posting online, or organizing locally, the
          <strong>Antifa symbol</strong> communicates a clear message: there is
          no neutrality when it comes to fascism. As historian
          <a
            href="https://fr.wikipedia.org/wiki/Mark_Bray"
            target="_blank"
            rel="noopener"
          >
            <strong> Mark Bray </strong>
          </a>
          writes in
          <a
            href="https://files.libcom.org/files/Antifa,%20The%20Anti-Fascist%20Handbook.pdf"
            target="_blank"
            rel="noopener"
          >
            <em> Antifa: The Anti-Fascist Handbook</em>
          </a>
          , &quot;anti-fascism is not a single ideology but a willingness to
          resist fascist organizing through whatever means are necessary&quot;.
        </p>
      </details>
      <div className="field">
        <label htmlFor="topText">Top text</label>
        <input
          type="text"
          id="topText"
          value={settings.topText}
          onChange={handleChange}
          spellCheck="false"
          name="topText"
        />
      </div>
      <div className="field">
        <label htmlFor="bottomText">Bottom text</label>
        <input
          type="text"
          id="bottomText"
          value={settings.bottomText}
          onChange={handleChange}
          spellCheck="false"
          name="bottomText"
        />
      </div>
      <hr />
      <div className="image_settings">
        <h3 className="text-lg font-black leading-4">Image Settings</h3>
        <div className="field">
          <label htmlFor="logoUpload">
            Central logo (SVG or png - <span>SVG works best</span>)
          </label>
          <div className="file-upload">
            <input
              type="file"
              id="logoUpload"
              accept="image/*,.svg"
              onChange={handleFileChange}
            />
            <span className="file-upload-icon">+</span>
            <span className="file-upload-text">
              Drop a file or <strong>browse</strong>
            </span>
          </div>
          <div className="note mb-4">
            Replaces the flags. Transparent background recommended.
          </div>
          <div>
            {settings.logoFile && (
              <div className="field">
                <label htmlFor="customLogoColorEnabled">
                  Use red/black color template ?{" "}
                </label>

                <label
                  className="relative h-8 w-12 cursor-pointer [-webkit-tap-highlight-color:transparent]"
                  htmlFor="customLogoColorEnabled"
                >
                  <input
                    className="peer sr-only"
                    id="customLogoColorEnabled"
                    type="checkbox"
                    onChange={handleChange}
                    name="customLogoColorEnabled"
                    checked={settings.customLogoColorEnabled}
                  />

                  <span
                    className={`absolute inset-0 m-auto h-2 transition duration-250 rounded-full ${!settings.customLogoColorEnabled ? "bg-[#1a1a1a]" : "bg-red"}`}
                  ></span>

                  <span className="absolute inset-y-0 inset-s-0 m-auto size-6 rounded-full bg-stone-600 transition-all peer-checked:inset-s-6 peer-checked:[&amp;_>_*]:scale-0">
                    <span
                      className={`absolute inset-0 m-auto size-4 rounded-full ${!settings.customLogoColorEnabled ? "bg-[#1a1a1a]" : "bg-red"} transition`}
                    ></span>
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>

        {settings.customLogoColorEnabled && settings.logoFile && (
          <div className="field">
            <label>
              Red/black split
              <span className="val" id="splitLabel">
                {" " + settings.rbSplit}%
              </span>
            </label>
            <input
              type="range"
              id="splitPos"
              min="0"
              max="100"
              value={settings.rbSplit}
              onChange={handleChange}
              name="rbSplit"
            />
          </div>
        )}
        {settings.logoFile && (
          <div>
            <div className="field">
              <label>
                Logo scale{" "}
                <span className="val" id="logoSzLabel">
                  {" " + settings.scale}%
                </span>
              </label>
              <input
                type="range"
                id="logoSz"
                min="30"
                max="150"
                value={settings.scale}
                onChange={handleChange}
                name="scale"
              />
            </div>

            <div className="field">
              <label>
                Logo position X{" "}
                <span className="val" id="logoXLabel">
                  {" " + settings.posX}
                </span>
              </label>
              <input
                type="range"
                id="logoX"
                min="-100"
                max="100"
                value={settings.posX}
                onChange={handleChange}
                name="posX"
              />
            </div>

            <div className="field">
              <label>
                Logo position Y{" "}
                <span className="val" id="logoYLabel">
                  {" " + settings.posY}
                </span>
              </label>
              <input
                type="range"
                id="logoY"
                min="-100"
                max="100"
                value={settings.posY}
                onChange={handleChange}
                name="posY"
              />
            </div>
          </div>
        )}
      </div>
      <hr />
      <div className="text_settings">
        <h3 className="text-lg font-black leading-4">Text Settings</h3>
        <div className="field">
          <label htmlFor="fontSize">
            Font size{" "}
            <span className="val" id="sizeLabel">
              {" " + settings.fontSize}px
            </span>
          </label>
          <input
            type="range"
            id="fontSize"
            min="16"
            max="56"
            value={settings.fontSize}
            onChange={handleChange}
            name="fontSize"
          />
        </div>
      </div>
      <hr />
    </div>
  );
}
