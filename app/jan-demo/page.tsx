"use client";

import Link from "next/link";
import { ChangeEvent, useMemo, useState } from "react";

type Role =
  | "Intake Agent"
  | "Ops Lead"
  | "Compliance Officer"
  | "Client Success";

type StageId =
  | "intake"
  | "qualification"
  | "proposal"
  | "approval"
  | "complete";

type StepFlagKey = "notifyClient" | "needsReview" | "requiresSignature";

interface Stage {
  id: StageId;
  label: string;
  role: Role;
  description: string;
}

interface DemoUser {
  id: string;
  name: string;
  role: Role;
}

interface StepFlags {
  notifyClient: boolean;
  needsReview: boolean;
  requiresSignature: boolean;
}

interface ProcessItem {
  id: string;
  caseRef: string;
  title: string;
  client: string;
  stageId: StageId;
  ownerId: string;
  skipNext: boolean;
  flags: StepFlags;
  documents: string[];
  signature: string;
  updatedAt: string;
}

interface ActivityItem {
  id: string;
  processId: string;
  message: string;
  at: string;
}

const STAGES: Stage[] = [
  {
    id: "intake",
    label: "1. Intake",
    role: "Intake Agent",
    description: "Collect request and capture baseline details.",
  },
  {
    id: "qualification",
    label: "2. Qualification",
    role: "Ops Lead",
    description: "Validate scope, value, and implementation fit.",
  },
  {
    id: "proposal",
    label: "3. Proposal",
    role: "Ops Lead",
    description: "Assemble process flow and commercial proposal.",
  },
  {
    id: "approval",
    label: "4. Approval",
    role: "Compliance Officer",
    description: "Review controls, sign-off, and readiness checks.",
  },
  {
    id: "complete",
    label: "5. Complete",
    role: "Client Success",
    description: "Handoff to delivery and close the process.",
  },
];

const DEFAULT_USERS: DemoUser[] = [
  { id: "u-intake", name: "Lebo M.", role: "Intake Agent" },
  { id: "u-ops", name: "Jan K.", role: "Ops Lead" },
  { id: "u-compliance", name: "Priya N.", role: "Compliance Officer" },
  { id: "u-success", name: "Siyanda P.", role: "Client Success" },
];

const INITIAL_PROCESSES: ProcessItem[] = [
  {
    id: "p-101",
    caseRef: "JAN-101",
    title: "Retail Onboarding Automation",
    client: "BrightMart",
    stageId: "intake",
    ownerId: "u-intake",
    skipNext: false,
    flags: { notifyClient: true, needsReview: true, requiresSignature: true },
    documents: ["requirements-brief.pdf"],
    signature: "",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p-102",
    caseRef: "JAN-102",
    title: "Insurance Claims Routing",
    client: "Northline Insure",
    stageId: "qualification",
    ownerId: "u-ops",
    skipNext: false,
    flags: { notifyClient: false, needsReview: true, requiresSignature: false },
    documents: [],
    signature: "",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p-103",
    caseRef: "JAN-103",
    title: "Municipal Permit Workflow",
    client: "Eastborough Council",
    stageId: "approval",
    ownerId: "u-compliance",
    skipNext: false,
    flags: { notifyClient: true, needsReview: true, requiresSignature: true },
    documents: ["risk-register.xlsx"],
    signature: "Pending signature",
    updatedAt: new Date().toISOString(),
  },
];

const ROLE_OPTIONS: Role[] = [
  "Intake Agent",
  "Ops Lead",
  "Compliance Officer",
  "Client Success",
];

const FLAG_LABELS: Record<StepFlagKey, string> = {
  notifyClient: "Notify client",
  needsReview: "Needs review",
  requiresSignature: "Requires signature",
};

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const JanDemoPage = () => {
  const [users, setUsers] = useState<DemoUser[]>(DEFAULT_USERS);
  const [activeUserId, setActiveUserId] = useState(DEFAULT_USERS[0].id);
  const [draftName, setDraftName] = useState("");
  const [draftRole, setDraftRole] = useState<Role>("Ops Lead");
  const [processes, setProcesses] = useState<ProcessItem[]>(INITIAL_PROCESSES);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [draggingProcessId, setDraggingProcessId] = useState<string | null>(null);

  const activeUser =
    users.find((user) => user.id === activeUserId) ?? DEFAULT_USERS[0];

  const stageLookup = useMemo(() => {
    return STAGES.reduce<Record<StageId, Stage>>((acc, stage) => {
      acc[stage.id] = stage;
      return acc;
    }, {} as Record<StageId, Stage>);
  }, []);

  const userLookup = useMemo(() => {
    return users.reduce<Record<string, DemoUser>>((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});
  }, [users]);

  const appendActivity = (processId: string, message: string) => {
    setActivity((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        processId,
        message,
        at: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const ownerForStage = (stageId: StageId, fallbackOwnerId: string) => {
    const requiredRole = stageLookup[stageId].role;
    const candidate = users.find((user) => user.role === requiredRole);
    return candidate?.id ?? fallbackOwnerId;
  };

  const moveProcess = (processId: string, targetStageId: StageId, reason: string) => {
    const current = processes.find((process) => process.id === processId);
    if (!current || current.stageId === targetStageId) {
      return;
    }

    const nextOwnerId = ownerForStage(targetStageId, current.ownerId);
    const nextOwner = userLookup[nextOwnerId];
    const previousOwner = userLookup[current.ownerId];

    setProcesses((prev) =>
      prev.map((process) =>
        process.id === processId
          ? {
              ...process,
              stageId: targetStageId,
              ownerId: nextOwnerId,
              skipNext: false,
              updatedAt: new Date().toISOString(),
            }
          : process,
      ),
    );

    const handoffSummary =
      previousOwner?.name !== nextOwner?.name
        ? ` | Handoff: ${previousOwner?.name ?? "Unassigned"} → ${nextOwner?.name ?? "Unassigned"}`
        : "";

    appendActivity(
      processId,
      `${reason}: ${stageLookup[current.stageId].label} → ${stageLookup[targetStageId].label}${handoffSummary}`,
    );
  };

  const advanceProcess = (processId: string) => {
    const current = processes.find((process) => process.id === processId);
    if (!current) {
      return;
    }

    const currentIndex = STAGES.findIndex((stage) => stage.id === current.stageId);
    if (currentIndex < 0 || currentIndex >= STAGES.length - 1) {
      return;
    }

    const jump = current.skipNext ? 2 : 1;
    const targetIndex = Math.min(currentIndex + jump, STAGES.length - 1);
    const reason = current.skipNext ? "Skipped next stage" : "Advanced stage";

    moveProcess(processId, STAGES[targetIndex].id, reason);
  };

  const moveBackProcess = (processId: string) => {
    const current = processes.find((process) => process.id === processId);
    if (!current) {
      return;
    }

    const currentIndex = STAGES.findIndex((stage) => stage.id === current.stageId);
    if (currentIndex <= 0) {
      return;
    }

    moveProcess(processId, STAGES[currentIndex - 1].id, "Moved back one stage");
  };

  const toggleFlag = (processId: string, key: StepFlagKey) => {
    setProcesses((prev) =>
      prev.map((process) =>
        process.id === processId
          ? {
              ...process,
              flags: {
                ...process.flags,
                [key]: !process.flags[key],
              },
              updatedAt: new Date().toISOString(),
            }
          : process,
      ),
    );

    appendActivity(processId, `${activeUser.name} toggled “${FLAG_LABELS[key]}”`);
  };

  const toggleSkipNext = (processId: string) => {
    const current = processes.find((process) => process.id === processId);
    if (!current) {
      return;
    }

    setProcesses((prev) =>
      prev.map((process) =>
        process.id === processId
          ? {
              ...process,
              skipNext: !process.skipNext,
              updatedAt: new Date().toISOString(),
            }
          : process,
      ),
    );

    appendActivity(
      processId,
      `${activeUser.name} ${current.skipNext ? "disabled" : "enabled"} skip-next`,
    );
  };

  const claimProcess = (processId: string) => {
    setProcesses((prev) =>
      prev.map((process) =>
        process.id === processId
          ? {
              ...process,
              ownerId: activeUser.id,
              updatedAt: new Date().toISOString(),
            }
          : process,
      ),
    );

    appendActivity(processId, `${activeUser.name} claimed this stage`);
  };

  const onUploadDocuments = (processId: string, event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }

    const nextDocs = Array.from(selectedFiles).map((file) => file.name);

    setProcesses((prev) =>
      prev.map((process) =>
        process.id === processId
          ? {
              ...process,
              documents: [...process.documents, ...nextDocs],
              updatedAt: new Date().toISOString(),
            }
          : process,
      ),
    );

    appendActivity(processId, `${activeUser.name} uploaded ${nextDocs.length} document(s)`);
    event.target.value = "";
  };

  const setSignature = (processId: string, signature: string) => {
    setProcesses((prev) =>
      prev.map((process) =>
        process.id === processId
          ? {
              ...process,
              signature,
              updatedAt: new Date().toISOString(),
            }
          : process,
      ),
    );
  };

  const applyCurrentUserSignature = (processId: string) => {
    setProcesses((prev) =>
      prev.map((process) =>
        process.id === processId
          ? {
              ...process,
              signature: activeUser.name,
              updatedAt: new Date().toISOString(),
            }
          : process,
      ),
    );

    appendActivity(processId, `${activeUser.name} signed off this stage`);
  };

  const addTemporaryUser = () => {
    if (!draftName.trim()) {
      return;
    }

    const newUser: DemoUser = {
      id: `u-${Date.now()}`,
      name: draftName.trim(),
      role: draftRole,
    };

    setUsers((prev) => [...prev, newUser]);
    setActiveUserId(newUser.id);
    setDraftName("");
  };

  return (
    <main className="mx-auto min-h-screen max-w-[1400px] px-4 py-6 text-slate-900 sm:px-6">
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Jan process automation demo
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Process board + role handoff</h1>
            <p className="mt-1 text-sm text-slate-600">
              Fake auth, kanban drag/drop, document uploads, signatures, and staged flow controls.
            </p>
          </div>
          <Link
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            href="/"
          >
            Back to home
          </Link>
        </div>
      </div>

      <section className="mb-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[2fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fake auth</p>
          <label className="mt-2 block text-sm font-medium text-slate-700" htmlFor="active-user">
            Active user
          </label>
          <select
            id="active-user"
            value={activeUserId}
            onChange={(event) => setActiveUserId(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} · {user.role}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-slate-600">
            Logged in as <span className="font-semibold">{activeUser.name}</span> ({activeUser.role})
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Add temporary user</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <input
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              placeholder="Name"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            <select
              value={draftRole}
              onChange={(event) => setDraftRole(event.target.value as Role)}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={addTemporaryUser}
            className="mt-2 w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
          >
            Add + switch user
          </button>
        </div>
      </section>

      <section className="mb-6">
        <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Kanban workflow</h2>
          <p className="text-xs text-slate-600">Tip: drag cards between columns to simulate handoffs.</p>
        </div>
        <p className="mb-2 text-xs font-medium text-slate-500 sm:hidden">
          Swipe left/right to view all stages →
        </p>

        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:gap-4">
          {STAGES.map((stage) => {
            const stageProcesses = processes.filter((process) => process.stageId === stage.id);

            return (
              <article
                key={stage.id}
                className="w-[86vw] max-w-[320px] shrink-0 snap-start rounded-xl border border-slate-200 bg-slate-50"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const droppedProcessId = event.dataTransfer.getData("text/plain") || draggingProcessId;
                  if (!droppedProcessId) {
                    return;
                  }
                  moveProcess(droppedProcessId, stage.id, "Dragged card");
                  setDraggingProcessId(null);
                }}
              >
                <header className="border-b border-slate-200 px-3 py-3">
                  <h3 className="text-sm font-semibold text-slate-900">{stage.label}</h3>
                  <p className="mt-1 text-xs text-slate-600">{stage.description}</p>
                  <p className="mt-1 text-xs font-medium text-slate-700">Owner role: {stage.role}</p>
                </header>

                <div className="space-y-3 p-3">
                  {stageProcesses.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-3 py-5 text-center text-xs text-slate-500">
                      Drop a process here
                    </div>
                  ) : (
                    stageProcesses.map((process) => {
                      const owner = userLookup[process.ownerId];

                      return (
                        <div
                          key={process.id}
                          draggable
                          onDragStart={(event) => {
                            setDraggingProcessId(process.id);
                            event.dataTransfer.setData("text/plain", process.id);
                          }}
                          onDragEnd={() => setDraggingProcessId(null)}
                          className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {process.caseRef}
                              </p>
                              <h4 className="text-sm font-semibold text-slate-900">{process.title}</h4>
                              <p className="text-xs text-slate-600">{process.client}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => claimProcess(process.id)}
                              className="rounded-md border border-slate-300 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
                            >
                              Claim
                            </button>
                          </div>

                          <p className="mt-2 text-xs text-slate-700">
                            Current owner: <span className="font-semibold">{owner?.name ?? "Unassigned"}</span>
                          </p>
                          <p className="text-[11px] text-slate-500">Updated {formatTime(process.updatedAt)}</p>

                          <div className="mt-3 space-y-2 rounded-md bg-slate-50 p-2">
                            {(Object.keys(FLAG_LABELS) as StepFlagKey[]).map((key) => (
                              <label key={key} className="flex items-center justify-between gap-2 text-xs text-slate-700">
                                <span>{FLAG_LABELS[key]}</span>
                                <input
                                  type="checkbox"
                                  checked={process.flags[key]}
                                  onChange={() => toggleFlag(process.id, key)}
                                  className="h-4 w-4"
                                />
                              </label>
                            ))}
                          </div>

                          <label className="mt-3 flex items-center justify-between rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-700">
                            <span>Skip next stage</span>
                            <input
                              type="checkbox"
                              checked={process.skipNext}
                              onChange={() => toggleSkipNext(process.id)}
                              className="h-4 w-4"
                            />
                          </label>

                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={() => moveBackProcess(process.id)}
                              className="flex-1 rounded-md border border-slate-300 px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            >
                              Move back
                            </button>
                            <button
                              type="button"
                              onClick={() => advanceProcess(process.id)}
                              className="flex-1 rounded-md bg-slate-900 px-2 py-1.5 text-xs font-medium text-white hover:bg-black"
                            >
                              Advance
                            </button>
                          </div>

                          <details className="mt-3 rounded-md border border-slate-200 p-2">
                            <summary className="cursor-pointer text-xs font-semibold text-slate-700">Documents</summary>
                            <div className="mt-2 space-y-2">
                              <input
                                type="file"
                                multiple
                                onChange={(event) => onUploadDocuments(process.id, event)}
                                className="w-full text-[11px]"
                              />
                              <ul className="space-y-1 text-[11px] text-slate-600">
                                {process.documents.length === 0 ? (
                                  <li>No docs uploaded</li>
                                ) : (
                                  process.documents.map((doc) => <li key={`${process.id}-${doc}`}>• {doc}</li>)
                                )}
                              </ul>
                            </div>
                          </details>

                          <details className="mt-2 rounded-md border border-slate-200 p-2" open>
                            <summary className="cursor-pointer text-xs font-semibold text-slate-700">Signature</summary>
                            <div className="mt-2 space-y-2">
                              <input
                                value={process.signature}
                                onChange={(event) => setSignature(process.id, event.target.value)}
                                placeholder="Type signature / initials"
                                className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                              />
                              <button
                                type="button"
                                onClick={() => applyCurrentUserSignature(process.id)}
                                className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                              >
                                Sign as {activeUser.name}
                              </button>
                            </div>
                          </details>
                        </div>
                      );
                    })
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Live activity feed</h2>
        <p className="mt-1 text-xs text-slate-600">Tracks stage changes, handoffs, toggles, docs, and signatures.</p>
        <ul className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1 text-xs text-slate-700">
          {activity.length === 0 ? (
            <li className="rounded-md border border-dashed border-slate-300 p-3 text-slate-500">
              No actions yet — start by dragging a card or clicking Advance.
            </li>
          ) : (
            activity.map((entry) => {
              const process = processes.find((item) => item.id === entry.processId);

              return (
                <li key={entry.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <p className="font-semibold text-slate-800">{process?.caseRef ?? entry.processId}</p>
                  <p>{entry.message}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{formatTime(entry.at)}</p>
                </li>
              );
            })
          )}
        </ul>
      </section>
    </main>
  );
};

export default JanDemoPage;
