const assignments = [
  { title: 'Data Structures - Arrays', due: 'Due tomorrow', status: 'Pending', dot: 'bg-yellow-400' },
  { title: 'OS - Process Scheduling', due: 'Due in 3 days', status: 'Submitted', dot: 'bg-green-400' },
  { title: 'DBMS - SQL Queries', due: 'Due in 5 days', status: 'Pending', dot: 'bg-yellow-400' },
  { title: 'Networks - TCP/IP', due: 'Due in 7 days', status: 'Graded', dot: 'bg-blue-400' },
];

const stats = [
  { label: 'Classrooms', value: '12', color: 'text-blue-400' },
  { label: 'Students', value: '284', color: 'text-green-400' },
  { label: 'Assignments', value: '47', color: 'text-purple-400' },
];

export default function DashboardMockup() {
  return (
    <div className="hidden md:block relative">
      <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full scale-75" />

      <div className="relative rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md overflow-hidden shadow-2xl">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.03]">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <div className="ml-3 flex-1 bg-white/[0.06] rounded-md px-3 py-1 text-xs text-zinc-500">
            digitalclassroom.app/dashboard
          </div>
        </div>

        <div className="p-5 space-y-3">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map(({ label, value, color }) => (
              <div key={label} className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06]">
                <div className={`text-xl font-bold ${color}`}>{value}</div>
                <div className="text-zinc-500 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Assignments table */}
          <div className="bg-white/[0.04] rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-white/[0.06] flex justify-between items-center">
              <span className="text-xs font-semibold text-zinc-300">Recent Assignments</span>
              <span className="text-xs text-blue-400 cursor-pointer hover:underline">View all</span>
            </div>
            {assignments.map(({ title, due, status, dot }) => (
              <div
                key={title}
                className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.03] transition-colors"
              >
                <div>
                  <div className="text-xs font-medium text-zinc-200">{title}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{due}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                  <span className="text-xs text-zinc-400">{status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06]">
              <div className="text-xs text-zinc-500 mb-2">Submission Rate</div>
              <div className="w-full bg-white/[0.06] rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '78%' }} />
              </div>
              <div className="text-xs text-zinc-300 mt-1.5 font-semibold">78%</div>
            </div>
            <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06]">
              <div className="text-xs text-zinc-500 mb-1">Live Session</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-zinc-300 font-medium">CS101 - Live now</span>
              </div>
              <button className="mt-2 text-xs bg-blue-600/80 hover:bg-blue-600 px-3 py-1 rounded-md text-white transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating user badges */}
      <div className="absolute -bottom-4 -left-6 flex items-center gap-2 bg-black/70 border border-white/10 rounded-xl px-3 py-2 backdrop-blur-md shadow-xl">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
          P
        </div>
        <div>
          <div className="text-xs font-semibold text-white">Priya S.</div>
          <div className="text-[10px] text-zinc-400">Joined via Google</div>
        </div>
      </div>

      <div className="absolute -top-4 -right-4 flex items-center gap-2 bg-black/70 border border-white/10 rounded-xl px-3 py-2 backdrop-blur-md shadow-xl">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-xs font-bold text-white">
          A
        </div>
        <div>
          <div className="text-xs font-semibold text-white">Arjun K.</div>
          <div className="text-[10px] text-zinc-400">Joined via invite</div>
        </div>
      </div>
    </div>
  );
}