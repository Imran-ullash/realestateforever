import { useState, useRef, useEffect, type FormEvent } from "react";
import { MessageSquare, X, Send, Sparkles, Shield, User, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { sendFormEmail } from "@/lib/mail.functions";
import { listings } from "@/data/listings";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

type LeadStage = "idle" | "asking_name" | "asking_email" | "asking_message" | "submitting" | "completed";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LuxuryConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Welcome to Real Estate Forever. How can we assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [leadStage, setLeadStage] = useState<LeadStage>("idle");
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [visitorInquiry, setVisitorInquiry] = useState("");
  const [detectedProperty, setDetectedProperty] = useState("");
  const [submissionError, setSubmissionError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const addMessage = (sender: "bot" | "user", text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        sender,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  // Check if text matches any available listing by city or state
  const matchProperty = (query: string): string => {
    const q = query.toLowerCase();
    for (const item of listings) {
      if (item.city.toLowerCase().includes(q) || q.includes(item.city.toLowerCase())) {
        return `${item.city}, ${item.state}`;
      }
    }
    return "";
  };

  // Natural real estate knowledge-base response generator
  const getKnowledgeResponse = (rawInput: string): { response: string; promptLead?: boolean; propName?: string } => {
    const input = rawInput.toLowerCase().trim();

    // 1. Check for specific inventory property queries by city or state
    for (const item of listings) {
      const cityLower = item.city.toLowerCase();
      if (input.includes(cityLower)) {
        return {
          response: `We have an opportunity in ${item.city}, ${item.state} featuring ${item.beds} beds, ${item.baths} baths, and ${item.area} sq ft. Specific street addresses and financial details are kept strictly confidential for qualified investors. Would you like to submit an inquiry?`,
          promptLead: true,
          propName: `${item.city}, ${item.state}`,
        };
      }
    }

    // 2. Check for fee or exact address inquiries (explicitly forbidden to invent or expose)
    if (input.includes("fee") || input.includes("cost") || input.includes("address") || input.includes("street") || input.includes("zip")) {
      return {
        response: "Specific property addresses, fees, and confidential pro-forma decks are shared directly with qualified investors upon inquiry. You can leave your contact details and our team will be happy to assist you.",
        promptLead: true,
      };
    }

    // 3. Questions about general inventory
    if (input.includes("inventory") || input.includes("available") || input.includes("properties") || input.includes("listing") || input.includes("homes")) {
      const listSummary = listings.slice(0, 4).map((p) => `${p.city}, ${p.state}`).join(", ");
      return {
        response: `Our portfolio includes verified opportunities in ${listSummary}, and other select markets across Georgia, Florida, North Carolina, and Texas. Would you like to inquire about a specific market or receive full details?`,
        promptLead: true,
      };
    }

    // 4. Questions about the company
    if (input.includes("who are you") || input.includes("about") || input.includes("company") || input.includes("what is real estate forever") || input.includes("what do you do")) {
      return {
        response: "Real Estate Forever is a private real estate investment and development firm. We curate high-yield, off-market residential and commercial development opportunities for buyers and investors seeking long-term capital appreciation.",
      };
    }

    // 5. Inquiries about investing, buying, or scheduling consultation
    if (input.includes("invest") || input.includes("buy") || input.includes("inquire") || input.includes("contact") || input.includes("speak") || input.includes("call") || input.includes("meeting") || input.includes("consultation")) {
      return {
        response: "Certainly. Our acquisitions leadership is pleased to assist you with confidential investment opportunities.",
        promptLead: true,
      };
    }

    // 6. Generic/fallback response (does not invent answers)
    return {
      response: "I don't have that information available right now, but you can leave your contact details and our team will be happy to assist you.",
      promptLead: true,
    };
  };

  // Submit collected lead to info@realestateforever.com
  const submitLead = async (name: string, email: string, inquiryText: string, property: string) => {
    setLeadStage("submitting");
    setSubmissionError(false);

    try {
      const fullContext = messages
        .concat([
          { id: "lead-final", sender: "user", text: inquiryText, timestamp: new Date().toLocaleTimeString() },
        ])
        .map((m) => `[${m.timestamp}] ${m.sender.toUpperCase()}: ${m.text}`)
        .join("\n");

      const res = await sendFormEmail({
        data: {
          form: "chatbot",
          name: name.trim(),
          email: email.trim(),
          property: property || detectedProperty || "",
          message: inquiryText.trim() || visitorInquiry.trim() || "General Chatbot Inquiry",
          conversationContext: fullContext,
        },
      });

      if (!res.ok) {
        throw new Error(res.error || "Email delivery failed");
      }

      setLeadStage("completed");
      addMessage("bot", "Thank you. We've received your inquiry and our team will get back to you.");
    } catch (err) {
      console.error("[Chatbot] Inquiry dispatch error:", err);
      setSubmissionError(true);
      setLeadStage("asking_message");
      addMessage(
        "bot",
        "We're sorry, but we couldn't submit your inquiry right now. Please try again in a moment.",
      );
    }
  };

  // Handle message sending & step-by-step lead progression
  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    addMessage("user", text);
    setInputValue("");

    // Step 1: In the middle of collecting visitor's name
    if (leadStage === "asking_name") {
      setVisitorName(text);
      setLeadStage("asking_email");
      setTimeout(() => {
        addMessage("bot", `Thank you, ${text}. What is the best email address to reach you?`);
      }, 400);
      return;
    }

    // Step 2: In the middle of collecting visitor's email
    if (leadStage === "asking_email") {
      if (!EMAIL_REGEX.test(text)) {
        setTimeout(() => {
          addMessage("bot", "Please enter a valid email address (e.g. name@domain.com) so our team can reach you.");
        }, 300);
        return;
      }
      setVisitorEmail(text);

      const effectiveInquiry = visitorInquiry.trim() || "Private Real Estate Inquiry";
      setLeadStage("submitting");
      setTimeout(() => {
        submitLead(visitorName || "Website Visitor", text, effectiveInquiry, detectedProperty);
      }, 300);
      return;
    }

    // Step 3: In the middle of collecting inquiry message
    if (leadStage === "asking_message") {
      setVisitorInquiry(text);
      submitLead(visitorName || "Website Visitor", visitorEmail, text, detectedProperty);
      return;
    }

    // Default conversational flow (leadStage === "idle" or "completed")
    const matched = matchProperty(text);
    if (matched) {
      setDetectedProperty(matched);
    }

    const { response, promptLead, propName } = getKnowledgeResponse(text);
    if (propName) {
      setDetectedProperty(propName);
    }

    setTimeout(() => {
      addMessage("bot", response);

      if (promptLead && leadStage !== "completed") {
        setVisitorInquiry(text);
        setTimeout(() => {
          setLeadStage("asking_name");
          addMessage("bot", "Certainly. May I have your name?");
        }, 600);
      }
    }, 400);
  };

  // Direct action chip click
  const handleQuickChip = (promptText: string) => {
    addMessage("user", promptText);
    setVisitorInquiry(promptText);
    const { response, propName } = getKnowledgeResponse(promptText);
    if (propName) {
      setDetectedProperty(propName);
    }
    setTimeout(() => {
      addMessage("bot", response);
      setTimeout(() => {
        setLeadStage("asking_name");
        addMessage("bot", "Certainly. May I have your name?");
      }, 500);
    }, 300);
  };

  return (
    <aside
      aria-label="Private AI Assistant"
      className="fixed bottom-5 right-5 z-50 select-none sm:bottom-6 sm:right-6"
    >
      {/* 1. Floating Chatbot Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Real Estate Assistant"
          className="group relative flex items-center gap-2.5 rounded-full border border-primary/40 bg-background/90 px-4 py-3 text-foreground shadow-2xl shadow-primary/20 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-primary/40 active:scale-95"
        >
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
          </span>
          <MessageSquare className="size-4 text-primary transition-transform duration-300 group-hover:scale-110" />
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
            Inquire · AI Concierge
          </span>
        </button>
      )}

      {/* 2. Compact Luxury Chat Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Real Estate Forever AI Assistant"
          className="flex h-[490px] w-[calc(100vw-32px)] max-w-[370px] flex-col overflow-hidden rounded-2xl border border-primary/35 bg-background/95 text-foreground shadow-2xl shadow-black/85 backdrop-blur-2xl transition-all duration-300 sm:w-[370px]"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-primary/20 bg-card/65 px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
                <Sparkles className="size-3.5" />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold leading-tight tracking-wide text-foreground">
                  Real Estate Forever
                </h3>
                <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-primary">
                  <span className="size-1.5 rounded-full bg-emerald-400" /> AI Real Estate Assistant
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat window"
              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-[13px] leading-relaxed">
            <div className="flex items-center gap-2 rounded-lg border border-primary/15 bg-primary/5 px-2.5 py-1.5 text-[10px] text-muted-foreground">
              <Shield className="size-3 shrink-0 text-primary" />
              <span>Inquiries are securely dispatched to senior leadership.</span>
            </div>

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[12.5px] ${
                    m.sender === "user"
                      ? "rounded-br-sm bg-primary text-primary-foreground font-medium"
                      : "rounded-bl-sm border border-foreground/10 bg-card/75 text-foreground/90 shadow-sm backdrop-blur-md"
                  }`}
                >
                  <p>{m.text}</p>
                  <span className="mt-1 block text-right text-[9px] opacity-60">{m.timestamp}</span>
                </div>
              </div>
            ))}

            {/* Quick Action Suggestion Chips (Available on initial greeting) */}
            {leadStage === "idle" && messages.length <= 2 && (
              <div className="pt-1">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Suggested topics:
                </p>
                <div className="flex flex-col gap-1.5">
                  {[
                    "View available inventory",
                    "How to invest with Real Estate Forever",
                    "Submit a private property inquiry",
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleQuickChip(chip)}
                      className="rounded-xl border border-primary/20 bg-background/50 px-3 py-1.5 text-left text-[11.5px] font-medium text-foreground/85 transition-all hover:border-primary hover:bg-primary/10 hover:text-primary active:scale-[0.98]"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Lead Status Indicators */}
            {leadStage === "submitting" && (
              <div className="flex items-center gap-2 text-[11px] text-primary">
                <span className="size-2 animate-ping rounded-full bg-primary" />
                <span>Dispatching inquiry to leadership...</span>
              </div>
            )}

            {leadStage === "completed" && (
              <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 p-2.5 text-[11px] text-primary">
                <CheckCircle2 className="size-3.5 shrink-0" />
                <span>Inquiry successfully logged and sent.</span>
              </div>
            )}

            {submissionError && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-[11px] text-destructive">
                <AlertCircle className="size-3.5 shrink-0" />
                <span>Submission encountered an issue. Please try again.</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Chat Input Bar */}
          <form
            onSubmit={handleSend}
            className="shrink-0 border-t border-primary/20 bg-card/65 p-2.5"
          >
            <div className="relative flex items-center">
              <input
                type={leadStage === "asking_email" ? "email" : "text"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  leadStage === "asking_name"
                    ? "Enter your name..."
                    : leadStage === "asking_email"
                      ? "Enter your email..."
                      : leadStage === "asking_message"
                        ? "Enter your inquiry..."
                        : "Ask about inventory or inquiries..."
                }
                autoFocus
                className="h-9 w-full rounded-full border border-foreground/20 bg-background/80 pl-3.5 pr-9 text-[12px] text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={!inputValue.trim()}
                className="absolute right-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
              >
                <Send className="size-3" />
              </button>
            </div>
          </form>
        </div>
      )}
    </aside>
  );
}
