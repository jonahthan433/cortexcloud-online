import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Availability {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
}

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export const AvailabilityManager = () => {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .order('day_of_week');
      
      if (error) throw error;

      // Create availability entries for all days if they don't exist
      const existingDays = data?.map(a => a.day_of_week) || [];
      const missingDays = DAYS_OF_WEEK.filter(day => !existingDays.includes(day.value));
      
      const newAvailability = [...(data || [])];
      
      for (const day of missingDays) {
        newAvailability.push({
          id: `temp-${day.value}`,
          day_of_week: day.value,
          start_time: "09:00",
          end_time: "17:00",
          is_available: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }

      newAvailability.sort((a, b) => a.day_of_week - b.day_of_week);
      setAvailability(newAvailability);
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast({
        title: "Error",
        description: "Failed to load availability settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAvailability = async (dayIndex: number, field: string, value: any) => {
    const updated = [...availability];
    updated[dayIndex] = { ...updated[dayIndex], [field]: value };
    setAvailability(updated);
  };

  const saveAvailability = async () => {
    setUpdating(true);
    try {
      // Delete all existing availability
      const { error: deleteError } = await supabase
        .from('availability')
        .delete()
        .gte('day_of_week', 0);

      if (deleteError) throw deleteError;

      // Insert only days that are available
      const availableDays = availability.filter(a => a.is_available);
      
      if (availableDays.length > 0) {
        const { error: insertError } = await supabase
          .from('availability')
          .insert(
            availableDays.map(({ id, created_at, updated_at, ...rest }) => rest)
          );

        if (insertError) throw insertError;
      }

      toast({
        title: "Success",
        description: "Availability settings saved successfully",
      });

      // Refresh data
      await fetchAvailability();
    } catch (error) {
      console.error('Error saving availability:', error);
      toast({
        title: "Error",
        description: "Failed to save availability settings",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading availability settings...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="gradient-text">Manage Availability</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {availability.map((day, index) => {
            const dayLabel = DAYS_OF_WEEK.find(d => d.value === day.day_of_week)?.label || "Unknown";
            
            return (
              <div key={day.day_of_week} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="flex items-center space-x-2 min-w-[120px]">
                  <Switch
                    checked={day.is_available}
                    onCheckedChange={(checked) => 
                      updateAvailability(index, 'is_available', checked)
                    }
                  />
                  <Label className="font-medium">{dayLabel}</Label>
                </div>
                
                {day.is_available && (
                  <div className="flex items-center space-x-2 flex-1">
                    <div className="space-y-1">
                      <Label htmlFor={`start-${day.day_of_week}`} className="text-xs">
                        Start Time
                      </Label>
                      <Input
                        id={`start-${day.day_of_week}`}
                        type="time"
                        value={day.start_time}
                        onChange={(e) => 
                          updateAvailability(index, 'start_time', e.target.value)
                        }
                        className="w-24"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor={`end-${day.day_of_week}`} className="text-xs">
                        End Time
                      </Label>
                      <Input
                        id={`end-${day.day_of_week}`}
                        type="time"
                        value={day.end_time}
                        onChange={(e) => 
                          updateAvailability(index, 'end_time', e.target.value)
                        }
                        className="w-24"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Button 
          onClick={saveAvailability} 
          className="w-full" 
          disabled={updating}
        >
          {updating ? "Saving..." : "Save Availability Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};