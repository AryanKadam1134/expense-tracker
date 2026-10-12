import { useNavigate } from "react-router-dom";
import { BellRing } from "lucide-react";

import ReminderCard from "../../../components/ReminderCard";
import CustomButton from "../../../components/ui/CustomButton";
import useReminders from "../../../hooks/useReminders";

const RemindersPage = () => {
  const navigate = useNavigate();
  const { reminders, setReminders, loadingReminders } = useReminders();

  return (
    <div className="flex flex-col gap-4">
      <CustomButton
        name="Add Reminder"
        icon={BellRing}
        onClick={() => navigate("add")}
        className="w-fit self-end"
      />

      {loadingReminders ? (
        <p>Loading reminders...</p>
      ) : reminders.length ? (
        reminders.map((reminder) => (
          <ReminderCard
            key={reminder._id}
            reminder={reminder}
            onDelete={() =>
              setReminders((current) =>
                current.filter((item) => item._id !== reminder._id),
              )
            }
          />
        ))
      ) : (
        <p>No reminders yet.</p>
      )}
    </div>
  );
};

export default RemindersPage;
