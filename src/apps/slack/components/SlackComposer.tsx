import { Button } from "@/components/ui/button";

export function SlackComposer() {
  return (
    <div className="composer">
      <div className="input">
        <div className="input-field">Message #design-lab</div>
        <div className="input-bar">
          <div className="tool-group">
            <button>
              <b>B</b>
            </button>
            <button>
              <i>I</i>
            </button>
            <button>
              <u>U</u>
            </button>
            <button>
              <s>S</s>
            </button>
          </div>
          <div className="tool-ic">
            <svg viewBox="0 0 16 16">
              <path d="M6.5 7.5l3-3 2 2-3 3m-3 1l-2 2 1.5 1.5" />
              <circle cx="5" cy="11" r="2.5" />
            </svg>
          </div>
          <div className="tool-ic">
            <svg viewBox="0 0 16 16">
              <path d="M4 4h8M4 8h8M4 12h5" />
            </svg>
          </div>
          <div className="tool-ic">
            <svg viewBox="0 0 16 16">
              <path d="M4 4l2 8 2-4 2 4 2-8" />
            </svg>
          </div>
          <div className="tool-ic">
            <svg viewBox="0 0 16 16">
              <text x="3" y="12" fontFamily="Georgia" fontSize="11" fill="none" stroke="currentColor" strokeWidth="0.8">
                A
              </text>
              <path d="M11 12l1.5-3" />
            </svg>
          </div>
          <div className="tool-ic">
            <svg viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="5" />
              <text x="5" y="11" fontSize="8" fill="currentColor">
                @
              </text>
            </svg>
          </div>
          <div className="tool-ic">
            <svg viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="5.5" fill="none" />
              <circle cx="6" cy="6.5" r="1" />
              <circle cx="10" cy="6.5" r="1" />
              <path d="M5.5 10.5c1 .8 3 .8 4 0" />
            </svg>
          </div>
          <div className="tool-ic">
            <svg viewBox="0 0 16 16">
              <path d="M6 3l5 4-5 4V7H3v2h3v4" />
            </svg>
          </div>
          <div className="spacer"></div>
          <div className="send">
            <Button variant="default" size="sm">Send</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
