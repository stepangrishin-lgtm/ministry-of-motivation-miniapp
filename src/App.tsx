import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

type Employee = {
  id: string;
  full_name: string;
  role: string;
  balance_points: number;
};

export default function App() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        // @ts-ignore
        const tg = window.Telegram?.WebApp;

        if (!tg) {
          setError("Telegram WebApp не найден");
          return;
        }

        tg.ready();

        const user = tg.initDataUnsafe?.user;

        if (!user?.id) {
          setError("Не удалось получить Telegram ID");
          return;
        }

        const { data, error } = await supabase.functions.invoke(
          "telegram-login",
          {
            body: {
              telegram_id: user.id,
              full_name: user.first_name,
            },
          }
        );

        if (error) {
          setError(error.message);
          return;
        }

        setEmployee(data.employee);
      } catch (e: any) {
        setError(String(e));
      }
    };

    run();
  }, []);

  return (
    <div style={{ padding: 16, fontFamily: "system-ui" }}>
      <h2>Министерство мотивации</h2>

      {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}

      {!error && !employee && <p>Загрузка…</p>}

      {employee && (
        <>
          <p><b>Здравствуйте, {employee.full_name}</b></p>
          <p>Роль: <b>{employee.role}</b></p>
          <p>Баланс: <b>{employee.balance_points}</b> баллов</p>
        </>
      )}
    </div>
  );
}
