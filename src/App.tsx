import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';

type Role = 'Personal' | 'Aluno';

type Workout = {
  id: string;
  title: string;
  sets: string;
  notes: string;
  done: boolean;
};

type Meal = {
  id: string;
  title: string;
  time: string;
  details: string;
};

type CheckIn = {
  id: string;
  date: string;
  status: 'feito' | 'pendente';
  note: string;
};

type Payment = {
  id: string;
  title: string;
  value: string;
  status: 'Pago' | 'Pendente';
};

type Message = {
  id: string;
  author: string;
  time: string;
  text: string;
  unread?: boolean;
};

type Profile = {
  name: string;
  role: Role;
  plan: string;
  focus: string;
  streak: number;
};

type Goal = {
  label: string;
  value: string;
  progress: number;
};

const defaultProfile: Profile = {
  name: 'Maria Silva',
  role: 'Personal',
  plan: 'Plano Premium',
  focus: 'Força + condicionamento',
  streak: 18,
};

const defaultWorkouts: Workout[] = [
  { id: 'w1', title: 'Supino reto', sets: '4 x 8', notes: 'Manteiga nas costas e ombros relaxados', done: true },
  { id: 'w2', title: 'Agachamento goblet', sets: '3 x 10', notes: 'Explosão e controlo na descida', done: false },
  { id: 'w3', title: 'Remada em T', sets: '4 x 10', notes: 'Quadril estável e ombros baixos', done: false },
];

const defaultMeals: Meal[] = [
  { id: 'm1', title: 'Café da manhã', time: '07:30', details: 'Ovo, iogurte e frutas + whey' },
  { id: 'm2', title: 'Almoço', time: '12:30', details: 'Frango, arroz integral e salada' },
  { id: 'm3', title: 'Pré-treino', time: '18:20', details: 'Banana + whey + água' },
  { id: 'm4', title: 'Jantar', time: '20:30', details: 'Salmão, batata doce e legumes' },
];

const defaultCheckIns: CheckIn[] = [
  { id: 'c1', date: 'Seg 08/10', status: 'feito', note: 'Treino concluído com 100% de presença' },
  { id: 'c2', date: 'Ter 09/10', status: 'pendente', note: 'Pendência de hidratação e sleep' },
  { id: 'c3', date: 'Qua 10/10', status: 'feito', note: 'Refeição e check-in de bem-estar' },
];

const defaultPayments: Payment[] = [
  { id: 'p1', title: 'Mensalidade', value: 'R$ 149,00', status: 'Pago' },
  { id: 'p2', title: 'Acompanhamento extra', value: 'R$ 79,00', status: 'Pendente' },
];

const defaultMessages: Message[] = [
  { id: 'msg1', author: 'Time BIGTEAM', time: 'Há 15 min', text: 'Seu plano foi readequado para a semana de performance.', unread: true },
  { id: 'msg2', author: 'Aluno', time: 'Ontem', text: 'Preciso ajustar o treino de quarta após o almoço.' },
  { id: 'msg3', author: 'Nutri', time: '2 dias', text: 'Aumentei a proteína do jantar para melhor recuperação.' },
];

const defaultGoals: Goal[] = [
  { label: 'Força', value: '80%', progress: 80 },
  { label: 'Definição', value: '72%', progress: 72 },
  { label: 'Resistência', value: '88%', progress: 88 },
];

const storageKey = 'bigteamapp-state';

function loadState() {
  if (typeof window === 'undefined') {
    return {
      profile: defaultProfile,
      workouts: defaultWorkouts,
      meals: defaultMeals,
      checkIns: defaultCheckIns,
      payments: defaultPayments,
      messages: defaultMessages,
      goals: defaultGoals,
    };
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return {
        profile: defaultProfile,
        workouts: defaultWorkouts,
        meals: defaultMeals,
        checkIns: defaultCheckIns,
        payments: defaultPayments,
        messages: defaultMessages,
        goals: defaultGoals,
      };
    }

    return JSON.parse(raw) as {
      profile: Profile;
      workouts: Workout[];
      meals: Meal[];
      checkIns: CheckIn[];
      payments: Payment[];
      messages: Message[];
      goals: Goal[];
    };
  } catch {
    return {
      profile: defaultProfile,
      workouts: defaultWorkouts,
      meals: defaultMeals,
      checkIns: defaultCheckIns,
      payments: defaultPayments,
      messages: defaultMessages,
      goals: defaultGoals,
    };
  }
}

function App() {
  const initialState = useMemo(() => loadState(), []);

  const [profile, setProfile] = useState<Profile>(initialState.profile);
  const [workouts, setWorkouts] = useState<Workout[]>(initialState.workouts);
  const [meals, setMeals] = useState<Meal[]>(initialState.meals);
  const [checkIns, setCheckIns] = useState<CheckIn[]>(initialState.checkIns);
  const [payments, setPayments] = useState<Payment[]>(initialState.payments);
  const [messages, setMessages] = useState<Message[]>(initialState.messages);
  const [goals, setGoals] = useState<Goal[]>(initialState.goals);

  useEffect(() => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ profile, workouts, meals, checkIns, payments, messages, goals }),
    );
  }, [profile, workouts, meals, checkIns, payments, messages, goals]);

  const dashboardStats = [
    { label: 'Treinos', value: `${workouts.filter((item) => item.done).length}/${workouts.length}` },
    { label: 'Check-ins', value: `${checkIns.filter((item) => item.status === 'feito').length}/${checkIns.length}` },
    { label: 'Mensagens', value: `${messages.filter((m) => m.unread).length}` },
    { label: 'Streak', value: `${profile.streak} dias` },
  ];

  const toggleWorkout = (id: string) => {
    setWorkouts((current) =>
      current.map((workout) =>
        workout.id === id ? { ...workout, done: !workout.done } : workout,
      ),
    );
  };

  const toggleCheckIn = (id: string) => {
    setCheckIns((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === 'feito' ? 'pendente' : 'feito',
              note:
                item.status === 'feito'
                  ? 'Atualização pendente de confirmação'
                  : 'Check-in confirmado com sucesso',
            }
          : item,
      ),
    );
  };

  const readMessages = () => {
    setMessages((current) => current.map((message) => ({ ...message, unread: false })));
  };

  const toggleRole = () => {
    setProfile((current) => ({
      ...current,
      role: current.role === 'Personal' ? 'Aluno' : 'Personal',
      plan: current.role === 'Personal' ? 'Plano Estudante' : 'Plano Premium',
      focus: current.role === 'Personal' ? 'Performance + nutrição' : 'Força + condicionamento',
    }));
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">B</div>
          <div>
            <strong>BIGTEAM</strong>
            <span>Fitness Hub</span>
          </div>
        </div>

        <nav className="nav-panel" aria-label="Navegação principal">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/treino">Treino</NavLink>
          <NavLink to="/dieta">Dieta</NavLink>
          <NavLink to="/checkin">Check-in</NavLink>
          <NavLink to="/pagamentos">Pagamentos</NavLink>
          <NavLink to="/mensagens" onClick={readMessages}>Mensagens</NavLink>
          <NavLink to="/evolucao">Evolução</NavLink>
        </nav>

        <div className="mini-profile">
          <div>
            <p className="eyebrow">Perfil</p>
            <h3>{profile.name}</h3>
          </div>
          <button type="button" className="ghost-button" onClick={toggleRole}>
            {profile.role}
          </button>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Resumo</p>
            <h1>{profile.plan}</h1>
          </div>
          <button type="button" className="primary-button">
            Agendar revisão
          </button>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <div className="page-grid">
                <section className="panel hero-panel">
                  <div>
                    <p className="eyebrow">Acompanhamento</p>
                    <h2>Bem-vindo ao BIGTEAM, {profile.name}</h2>
                    <p>
                      Foco atual: <strong>{profile.focus}</strong>
                    </p>
                  </div>
                  <div className="pill-row">
                    <span className="pill">{profile.role}</span>
                    <span className="pill success">{profile.streak} dias</span>
                  </div>
                </section>

                <div className="stats-grid">
                  {dashboardStats.map((stat) => (
                    <div key={stat.label} className="panel stat-card">
                      <span>{stat.label}</span>
                      <strong>{stat.value}</strong>
                    </div>
                  ))}
                </div>

                <section className="panel list-panel">
                  <div className="section-heading">
                    <h3>Próximos passos</h3>
                    <a href="/treino">Abrir</a>
                  </div>
                  <ul className="todo-list">
                    {workouts.slice(0, 3).map((workout) => (
                      <li key={workout.id}>
                        <span className={workout.done ? 'dot success' : 'dot'} />
                        <div>
                          <strong>{workout.title}</strong>
                          <small>{workout.sets}</small>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="panel list-panel">
                  <div className="section-heading">
                    <h3>Mensagens recentes</h3>
                    <a href="/mensagens">Ver tudo</a>
                  </div>
                  <ul className="chat-list">
                    {messages.map((message) => (
                      <li key={message.id}>
                        <strong>{message.author}</strong>
                        <span>{message.time}</span>
                        <p>{message.text}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            }
          />

          <Route
            path="/treino"
            element={
              <div className="page-grid single-column">
                <section className="panel list-panel">
                  <div className="section-heading">
                    <h3>Treino da semana</h3>
                    <span>{workouts.filter((item) => item.done).length}/{workouts.length}</span>
                  </div>
                  <ul className="stack-list">
                    {workouts.map((workout) => (
                      <li key={workout.id}>
                        <div>
                          <strong>{workout.title}</strong>
                          <small>{workout.notes}</small>
                        </div>
                        <div className="meta-inline">
                          <span>{workout.sets}</span>
                          <button
                            type="button"
                            className={workout.done ? 'toggle-button active' : 'toggle-button'}
                            onClick={() => toggleWorkout(workout.id)}
                          >
                            {workout.done ? 'Concluído' : 'Marcar'}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            }
          />

          <Route
            path="/dieta"
            element={
              <div className="page-grid single-column">
                <section className="panel list-panel">
                  <div className="section-heading">
                    <h3>Planejamento alimentar</h3>
                    <span>4 refeições</span>
                  </div>
                  <div className="meal-grid">
                    {meals.map((meal) => (
                      <article key={meal.id} className="meal-card">
                        <span className="meal-time">{meal.time}</span>
                        <h4>{meal.title}</h4>
                        <p>{meal.details}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            }
          />

          <Route
            path="/checkin"
            element={
              <div className="page-grid single-column">
                <section className="panel list-panel">
                  <div className="section-heading">
                    <h3>Check-ins</h3>
                    <span>{checkIns.filter((item) => item.status === 'feito').length} confirmados</span>
                  </div>
                  <ul className="stack-list">
                    {checkIns.map((item) => (
                      <li key={item.id}>
                        <div>
                          <strong>{item.date}</strong>
                          <small>{item.note}</small>
                        </div>
                        <button
                          type="button"
                          className={item.status === 'feito' ? 'toggle-button active' : 'toggle-button'}
                          onClick={() => toggleCheckIn(item.id)}
                        >
                          {item.status === 'feito' ? 'Feito' : 'Pendente'}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            }
          />

          <Route
            path="/pagamentos"
            element={
              <div className="page-grid single-column">
                <section className="panel list-panel">
                  <div className="section-heading">
                    <h3>Financeiro</h3>
                    <span>Resumo</span>
                  </div>
                  <div className="payment-grid">
                    {payments.map((payment) => (
                      <div key={payment.id} className="payment-card">
                        <div>
                          <p>{payment.title}</p>
                          <strong>{payment.value}</strong>
                        </div>
                        <span className={payment.status === 'Pago' ? 'tag success' : 'tag warning'}>
                          {payment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            }
          />

          <Route
            path="/mensagens"
            element={
              <div className="page-grid single-column">
                <section className="panel list-panel">
                  <div className="section-heading">
                    <h3>Mensagens</h3>
                    <span>{messages.filter((m) => m.unread).length} não lidas</span>
                  </div>
                  <ul className="chat-list">
                    {messages.map((message) => (
                      <li key={message.id}>
                        <div className="message-head">
                          <strong>{message.author}</strong>
                          {message.unread ? <span className="dot success" /> : null}
                        </div>
                        <span>{message.time}</span>
                        <p>{message.text}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            }
          />

          <Route
            path="/evolucao"
            element={
              <div className="page-grid single-column">
                <section className="panel list-panel">
                  <div className="section-heading">
                    <h3>Evolução</h3>
                    <span>Últimos 30 dias</span>
                  </div>
                  <div className="goal-grid">
                    {goals.map((goal) => (
                      <div key={goal.label} className="goal-card">
                        <div className="goal-topline">
                          <span>{goal.label}</span>
                          <strong>{goal.value}</strong>
                        </div>
                        <div className="progress-track">
                          <span style={{ width: `${goal.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
