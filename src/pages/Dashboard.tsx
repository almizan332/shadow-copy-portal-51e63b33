import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Globe, Users, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState<'1d' | '1w' | '1m' | '1y'>('1w');

  // Sample data - replace with real data in production
  const trafficData = [
    { name: 'Jan', visits: 4000 },
    { name: 'Feb', visits: 3000 },
    { name: 'Mar', visits: 5000 },
    { name: 'Apr', visits: 2780 },
    { name: 'May', visits: 1890 },
    { name: 'Jun', visits: 2390 },
    { name: 'Jul', visits: 3490 },
  ];

  const topCountries = [
    { country: 'United States', visits: 12500 },
    { country: 'United Kingdom', visits: 8300 },
    { country: 'Germany', visits: 6200 },
    { country: 'France', visits: 5100 },
    { country: 'India', visits: 4800 },
  ];

  const stats = [
    { title: 'Total Visitors', value: '45.2K', icon: Users, change: '+12.5%' },
    { title: 'Avg. Time', value: '3m 42s', icon: Clock, change: '+8.2%' },
    { title: 'Countries', value: '92', icon: Globe, change: '+3.1%' },
    { title: 'Total Pages', value: '845', icon: FileText, change: '+5.4%' },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin</p>
        </div>
        <div className="space-x-2">
          <Button 
            variant={timeRange === '1d' ? 'default' : 'outline'} 
            onClick={() => setTimeRange('1d')}
          >
            1D
          </Button>
          <Button 
            variant={timeRange === '1w' ? 'default' : 'outline'} 
            onClick={() => setTimeRange('1w')}
          >
            1W
          </Button>
          <Button 
            variant={timeRange === '1m' ? 'default' : 'outline'} 
            onClick={() => setTimeRange('1m')}
          >
            1M
          </Button>
          <Button 
            variant={timeRange === '1y' ? 'default' : 'outline'} 
            onClick={() => setTimeRange('1y')}
          >
            1Y
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <p className="text-sm text-green-500 mt-1">{stat.change}</p>
              </div>
              <stat.icon className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>

      {/* Traffic Chart */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Traffic Overview</h2>
        <div className="h-[400px]">
          <ChartContainer
            config={{
              visits: {
                label: "Visits",
                theme: {
                  light: "hsl(var(--primary))",
                  dark: "hsl(var(--primary))",
                },
              },
            }}
          >
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorVisits)"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </Card>

      {/* Top Countries */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Top Countries</h2>
        <div className="space-y-4">
          {topCountries.map((country) => (
            <div key={country.country} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <span>{country.country}</span>
              </div>
              <span className="font-semibold">{country.visits.toLocaleString()} visits</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;