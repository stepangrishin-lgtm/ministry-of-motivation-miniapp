import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Employee = {
  id: string;
  full_name: string | null;
  role: "employee" | "operator" | "admin";
  balance_points: number;
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // @ts-ignore
        const tg = window.Telegram?.WebApp;
        if (!tg) throw new Error("Откройте приложение через Telegram");

        tg.ready();

        const user = tg.initDataUnsafe?.user;

if (!user?.id) {
  throw new Error("Telegram user not found");
}

const { data, error } = await supabase.functions.invoke("telegram-login", {
  body: {
    telegram_id: user.id,
    full_name: user.first_name,
  },
});

        if (error) throw error;

        setEmployee(data.employee);
      } catch (e: any) {
        setError(e.message ?? String(e));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto" }}>
      <h2>Министерство мотивации</h2>

      {loading && <p>Загрузка…</p>}

      {error && (
        <div style={{ color: "red" }}>
          Ошибка: {error}
        </div>
      )}

      {employee && (
  <div style={{ marginTop: 16 }}>
    <p>
      <b>
        Здравствуйте{employee.full_name ? ", " + employee.full_name : ""}!
      </b>
    </p>

    <p>
      Роль: <b>{employee.role}</b>
    </p>

    <p>
      Баланс: <b>{employee.balance_points}</b> баллов
    </p>
  </div>
)}
    </div>
  );
}
