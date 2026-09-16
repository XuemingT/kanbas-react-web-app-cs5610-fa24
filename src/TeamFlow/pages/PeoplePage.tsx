import { useEffect, useMemo, useState } from "react";
import { createDirectChannel, getPeople } from "../../Kanbas/teamflowClient";
import { CURRENT_USER } from "../data";

type Person = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  team: string;
};

const colors = ["#7C5CFC", "#38BDF8", "#10B981", "#F59E0B", "#EF4444"];
const columns = "minmax(0, 2fr) minmax(130px, 1.4fr) minmax(120px, 1fr) 116px";
const nameOf = (person: Person) => `${person.firstName} ${person.lastName}`.trim();
const initials = (person: Person) =>
  `${person.firstName?.[0] || ""}${person.lastName?.[0] || ""}`.toUpperCase();

export default function PeoplePage({ onChat }: { onChat: (channelId: string) => void }) {
  const [people, setPeople] = useState<Person[]>([]);
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [search, setSearch] = useState("");
  const [opening, setOpening] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getPeople().then(setPeople).catch(() => setError("Could not load your team."));
  }, []);

  useEffect(() => {
    const term = search.trim();
    if (!term) {
      setSearchResults([]);
      return;
    }
    const timer = window.setTimeout(() => {
      getPeople(term).then(setSearchResults).catch(() => setError("Could not search people."));
    }, 180);
    return () => window.clearTimeout(timer);
  }, [search]);

  const filtered = useMemo(
    () => (search.trim() ? searchResults : people),
    [people, search, searchResults],
  );

  const startChat = async (person: Person) => {
    try {
      setOpening(person._id);
      setError("");
      const channel = await createDirectChannel(person._id);
      onChat(channel._id);
    } catch {
      setError("Could not open this direct message.");
    } finally {
      setOpening(null);
    }
  };

  const team = people[0]?.team || "Your team";

  return (
    <div className="min-h-full p-7 sm:p-8">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold leading-tight text-[#111827]">People</h1>
        <p className="mt-1 text-[13.5px] text-[#6B7280]">
          {search.trim() ? "Workspace search results" : `${team} · ${people.length} members`}
        </p>
      </div>

      <div className="mb-5 flex max-w-xs items-center gap-2 rounded-xl border border-[#EAECF0] bg-white px-3.5 py-2">
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="text-[#9CA3AF]">
          <circle cx="6" cy="6" r="4.25" stroke="currentColor" strokeWidth="1.3" />
          <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search the workspace…"
          className="flex-1 bg-transparent text-[13px] text-[#374151] outline-none"
        />
      </div>

      {error && <p className="mb-4 text-[12px] text-red-600">{error}</p>}

      <div className="overflow-hidden rounded-2xl border border-[#EAECF0] bg-white">
        <div
          className="hidden border-b border-[#F0F0F4] px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF] sm:grid"
          style={{ gridTemplateColumns: columns }}
        >
          <span>Name</span><span>Role</span><span>Team</span><span />
        </div>

        {filtered.map((person, index) => {
          const self = person._id === CURRENT_USER.id;
          const canChat = person.team !== "Other workspace member";
          return (
            <div
              key={person._id}
              className="grid items-center gap-3 px-5 py-3.5 hover:bg-[#FAFAFA]"
              style={{
                gridTemplateColumns: columns,
                borderBottom: index < filtered.length - 1 ? "1px solid #F7F7F9" : "none",
              }}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{ background: colors[index % colors.length] }}
                >
                  {initials(person)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-semibold text-[#111827]">
                    {nameOf(person)}{self && <span className="ml-1 font-normal text-[#9CA3AF]">(You)</span>}
                  </p>
                  <p className="truncate text-[11.5px] text-[#9CA3AF]">{person.email}</p>
                </div>
              </div>
              <span className="truncate text-[13px] text-[#6B7280]">{person.role}</span>
              <span className="truncate text-[13px] text-[#6B7280]">{person.team}</span>
              <div className="flex w-[116px] justify-end">
                {self ? <span className="px-3 text-[12px] text-[#9CA3AF]">You</span> : canChat ? (
                  <button disabled={opening === person._id} onClick={() => startChat(person)} className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#EEE9FF] px-3 py-1.5 text-[12.5px] font-medium text-[#7C5CFC] hover:bg-[#7C5CFC] hover:text-white disabled:opacity-60">
                    <svg className="flex-shrink-0" width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M1.5 2.5A1 1 0 012.5 1.5h9A1 1 0 0111.5 9.5H8L5.5 12V9.5H2.5A1 1 0 011.5 8.5v-6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
                    {opening === person._id ? "Opening…" : "Chat"}
                  </button>
                ) : <span className="text-[11px] text-[#9CA3AF]">Outside team</span>}
              </div>
            </div>
          );
        })}
        {!filtered.length && <p className="py-12 text-center text-[13.5px] text-[#9CA3AF]">No people match your search.</p>}
      </div>
    </div>
  );
}
