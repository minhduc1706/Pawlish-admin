import { Calendar, Clock, User, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const appointments = [
  {
    id: 1,
    petName: "Milo",
    ownerName: "John Doe",
    service: "Grooming",
    date: "03/10/2025",
    time: "09:00 - 10:00",
    status: "confirmed",
  },
  {
    id: 2,
    petName: "Luna",
    ownerName: "Jane Smith",
    service: "Bath and Hygiene",
    date: "03/10/2025",
    time: "13:30 - 14:30",
    status: "confirmed",
  },
  {
    id: 3,
    petName: "Max",
    ownerName: "Michael Johnson",
    service: "Routine Checkup",
    date: "03/15/2025",
    time: "10:15 - 11:00",
    status: "pending",
  },
]

const DashboardUpcomingAppointments = () => {
  return (
    <Card className="shadow-md h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Upcoming Appointments</CardTitle>
            <CardDescription>Upcoming appointments in the system</CardDescription>
          </div>
          <Badge variant="outline" className="flex gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{appointments.length} appointments</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No upcoming appointments</p>
          ) : (
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="rounded-lg border p-3 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{appointment.service}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                        <User className="h-3.5 w-3.5" />
                        {appointment.petName} ({appointment.ownerName})
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={appointment.status === "confirmed" ? "text-green-600 border-green-600" : ""}
                    >
                      {appointment.status === "confirmed" ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Confirmed
                        </span>
                      ) : (
                        "Pending Confirmation"
                      )}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <div className="px-6 pb-4">
        <Link to="/admin/appointments">
          <Button variant="outline" size="sm" className="w-full">
            View All Appointments
          </Button>
        </Link>
      </div>
    </Card>
  )
}

export default DashboardUpcomingAppointments
