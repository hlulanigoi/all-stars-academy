import { SectionHeading } from "@/components/SectionHeading";
import { Download, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Schedule() {
  return (
    <div className="min-h-screen bg-white py-24">
      <div className="container mx-auto px-4">
        <SectionHeading title="Class Timetable" subtitle="Plan Your Success" />
        
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-12">
          {/* Extra Classes */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <CalendarClock size={24} />
              </div>
              <h3 className="text-2xl font-bold font-display text-primary">Extra Classes</h3>
            </div>
            
            <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="p-4 font-semibold">Day</th>
                    <th className="p-4 font-semibold">Time</th>
                    <th className="p-4 font-semibold">Focus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="p-4 font-medium">Fridays</td>
                    <td className="p-4 text-gray-600">Selected Dates</td>
                    <td className="p-4 text-gray-600">Revision / Exams</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Saturdays</td>
                    <td className="p-4 text-gray-600">08:00 - 14:00</td>
                    <td className="p-4 text-gray-600">Core Subjects</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Sundays</td>
                    <td className="p-4 text-gray-600">09:00 - 13:00</td>
                    <td className="p-4 text-gray-600">Maths & Science</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Holidays</td>
                    <td className="p-4 text-gray-600">Bootcamps</td>
                    <td className="p-4 text-gray-600">Intensive Prep</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Matric Rewrite */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-primary">
                <CalendarClock size={24} />
              </div>
              <h3 className="text-2xl font-bold font-display text-primary">Matric Rewrite</h3>
            </div>
            
            <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-secondary text-primary">
                  <tr>
                    <th className="p-4 font-bold">Day</th>
                    <th className="p-4 font-bold">Time</th>
                    <th className="p-4 font-bold">Session</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="p-4 font-medium">Monday</td>
                    <td className="p-4 text-gray-600">08:00 - 15:00</td>
                    <td className="p-4 text-gray-600">Full Day Classes</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Tue - Thu</td>
                    <td className="p-4 text-gray-600">08:00 - 15:00</td>
                    <td className="p-4 text-gray-600">Full Day Classes</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Friday</td>
                    <td className="p-4 text-gray-600">08:00 - 13:00</td>
                    <td className="p-4 text-gray-600">Assessments</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Saturday</td>
                    <td className="p-4 text-gray-600">Optional</td>
                    <td className="p-4 text-gray-600">Extra Support</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" className="gap-2 border-primary text-primary hover:bg-primary hover:text-white transition-all">
            <Download size={20} /> Download Full 2025 Calendar
          </Button>
          <p className="text-sm text-gray-500 mt-4">*Schedule subject to change based on exam periods.</p>
        </div>
      </div>
    </div>
  );
}
