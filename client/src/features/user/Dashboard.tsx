"use client";

import { authService } from "@/app/page";
import TableComponent from "@/components/tables/TableComponent";
import Button from "@/components/ui/Button";
import Cards from "@/components/ui/Cards";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
const UserDashboard = () => {
  const [tableData, setTableData] = useState([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const data = [
    {
      submissionId: 1,
      location: "New York",
      areaClaimed: "100 ha",
      status: "Approved",
    },
    {
      submissionId: 2,
      location: "Los Angeles",
      areaClaimed: "150 ha",
      status: "Pending",
    },
    {
      submissionId: 3,
      location: "Los Angeles",
      areaClaimed: "150 ha",
      status: "In progress",
    },
  ];
  const [cardsData, setCardsData] = useState({
    totalAreaClaimed: 0,
    totalAreaVerified: 0,
    totalTokens: 0,
    pendingVerifications: 0,
  });
  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await fetch(`${authService}/users/dashboard/home`, {
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setTableData(data.recentSubmissions);

        setCardsData(data.cards);

        setAnalytics(data.analytics);
      }
    };

    fetchDashboard();
  }, []);
  const cardData = [
    {
      title: (
        <span className="text-xl">
          Total <br /> Area Claimed
        </span>
      ),
      subtext: (
        <p className="text-3xl font-extrabold">{cardsData.totalAreaClaimed}</p>
      ),
      body: "hectares",
    },
    {
      title: (
        <span className="text-xl">
          Total <br /> Area Verified
        </span>
      ),
      subtext: (
        <p className="text-3xl font-extrabold">{cardsData.totalAreaVerified}</p>
      ),
      body: "hectares",
    },
    {
      title: (
        <span className="text-xl">
          Carbon <br /> Tokens Earned
        </span>
      ),
      subtext: (
        <p className="text-3xl font-extrabold">{cardsData.totalTokens}</p>
      ),
      body: "tokens",
    },
    {
      title: (
        <span className="text-xl">
          Pending <br /> Verifications
        </span>
      ),
      subtext: (
        <p className="text-3xl font-extrabold">
          {cardsData.pendingVerifications}
        </p>
      ),
      body: "Submissions",
    },
  ];
  const router = useRouter();

  return (
    <div className="space-y-6 text-gray-700">
      <div
        id="top"
        className="flex justify-between items-center flex-wrap  py-1 "
      >
        <div>
          <h1 className="text-3xl font-bold ">Welcome, {"x"}!</h1>
          <h2 className="text-xl">Keep Making Imapact!</h2>
        </div>
        <Button
          size="md"
          variant="primary"
          text={"New Submission"}
          onClick={() => router.push("/user/camera")}
        />
      </div>
      {/* smplify later */}
      <div id="cards" className="flex flex-wrap justify-evenly py-3 gap-2">
        {cardData.map((card, idx) => (
          <Cards
            key={idx}
            className="h-60 w-72 bg-white text-zinc-800 "
            title={card.title}
            subtext={card.subtext}
            body={card.body}
          />
        ))}
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-3 -mt-1 ">Recent Submission</h1>
        <TableComponent rows={tableData} />
      </div>
      {/* analytics */}
      {analytics && (
  <div className="space-y-8 mt-10">

    {/* 🔥 Section Title */}
    <div>
      <h1 className="text-3xl font-bold">
        Impact Analytics
      </h1>

      <p className="text-gray-500">
        Real-time insights from your blue carbon projects
      </p>
    </div>

    {/* 🟢 TOP ANALYTICS GRID */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* 📈 CARBON TREND */}
      <div className="bg-white rounded-3xl p-6 shadow">

        <h2 className="text-xl font-bold mb-6">
          Carbon Growth Trend
        </h2>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.yearlyCarbon}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="carbon"
                stroke="#16a34a"
                strokeWidth={4}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🥧 STATUS CHART */}
      <div className="bg-white rounded-3xl p-6 shadow">

        <h2 className="text-xl font-bold mb-6">
          Submission Status
        </h2>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>

              <Pie
                data={analytics.statusAnalytics}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                <Cell fill="#22c55e" />
                <Cell fill="#eab308" />
                <Cell fill="#ef4444" />
                <Cell fill="#3b82f6" />
              </Pie>

              <Tooltip />

            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    {/* 🌍 IMPACT STATS */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-3xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold">
          Estimated CO₂ Offset
        </h3>

        <p className="text-5xl font-extrabold mt-4">
          {cardsData.totalTokens}
        </p>

        <p className="mt-2 opacity-80">
          tons of CO₂ removed
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-3xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold">
          Mangrove Coverage
        </h3>

        <p className="text-5xl font-extrabold mt-4">
          {cardsData.totalAreaClaimed}
        </p>

        <p className="mt-2 opacity-80">
          hectares protected
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white rounded-3xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold">
          Monitoring Reports
        </h3>

        <p className="text-5xl font-extrabold mt-4">
          {analytics.monitoringCompleted}
        </p>

        <p className="mt-2 opacity-80">
          yearly audits completed
        </p>
      </div>
    </div>

    {/* 🕒 MONITORING TIMELINE */}
    <div className="bg-white rounded-3xl p-6 shadow">

      <h2 className="text-2xl font-bold mb-6">
        Monitoring Timeline
      </h2>

      <div className="space-y-4">

        {analytics.yearlyCarbon.map((y: any, idx: number) => (
          <div
            key={idx}
            className="flex justify-between items-center border-l-4 border-green-500 bg-green-50 p-4 rounded-xl"
          >
            <div>
              <h3 className="font-bold">
                Monitoring Year {y.year}
              </h3>

              <p className="text-sm text-gray-500">
                Verified carbon monitoring completed
              </p>
            </div>

            <div className="text-green-600 font-bold text-lg">
              +{y.carbon} CO₂
            </div>
          </div>
        ))}

      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default UserDashboard;
