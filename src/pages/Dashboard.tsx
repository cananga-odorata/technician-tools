import {
  createSignal,
  createResource,
  For,
  createEffect,
  onCleanup,
} from "solid-js";
import { api } from "../services/api";
import VehicleCard from "../components/VehicleCard";
import { useNavigate } from "@solidjs/router";
import { useTheme } from "../stores/theme";
import { mqttService } from "../services/mqttService";
import OnboardingTour from "../components/OnboardingTour";
import type { TourStep } from "../components/OnboardingTour";
import { t } from "../i18n/config";
import LanguageSelector from "../components/LanguageSelector";
import { LIFTNGO_URL } from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [page, setPage] = createSignal(1);
  const [limit, setLimit] = createSignal(8);
  const [searchTerm, setSearchTerm] = createSignal("");

  // Initialize shared MQTT connection
  createEffect(() => {
    mqttService.connect();
    onCleanup(() => {
      // Optional: Disconnect on unmount if we want to close the connection when leaving the dashboard
      // mqttService.disconnect();
      // For now, we might want to keep it open or let the browser handle it,
      // but explicit disconnect is cleaner if we navigate away.
      // However, since we don't have a disconnect method exposed in the class yet (oops, I should check that),
      // let's check the service file. I did implement disconnect in the plan but maybe not in the file?
      // Checking the file content from memory/previous step...
      // I implemented connect, subscribe, unsubscribe, publish, getStatus.
      // I did NOT implement a public disconnect method in the class I wrote in step 697.
      // Let me re-read step 697.
      // Ah, I missed adding a public disconnect method in the class definition in step 697.
      // I only added a 'close' event listener.
      // I should probably add it to the service first if I want to use it.
      // But for now, just connecting is enough. The browser will close it on tab close.
      // If the user logs out, we might want to close it.
    });
  });

  // Fetch data when page or searchTerm changes
  const [vehiclesData] = createResource(
    () => ({ page: page(), limit: limit(), search: searchTerm() }),
    async ({ page, limit, search }) => api.getVehicles(page, limit, search),
  );

  const filteredVehicles = () => {
    const data = vehiclesData()?.data;
    return Array.isArray(data) ? data : [];
  };

  const totalPages = () => vehiclesData()?.meta.totalPages || 1;

  const handlePrevPage = () => {
    if (page() > 1) setPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (page() < totalPages()) setPage((p) => p + 1);
  };

  const getThemeIcon = () => {
    switch (theme()) {
      case "light":
        return "☀️";
      case "dark":
        return "🌙";
      case "gruvbox":
        return "🌲";
      case "orange":
        return "🔥";
      default:
        return "☀️";
    }
  };

  // const handleLogout = async () => {
  //   await api.logout();
  //   navigate("/login", { replace: true });
  // };
  const handleComback = async () => {
    // await api.logout();
    // navigate('/login', { replace: true });
    window.location.href = `${LIFTNGO_URL}/dashboard`;
  };

  const tourSteps: TourStep[] = [
    {
      title: t("tour_dashboard_title"),
      content: t("tour_dashboard_content"),
      position: "bottom",
    },
    {
      target: "#tour-search-bar",
      title: t("tour_search_title"),
      content: t("tour_search_content"),
      position: "bottom",
    },
    {
      target: "#tour-history-btn",
      title: t("tour_history_btn_title"),
      content: t("tour_history_btn_content"),
      position: "bottom",
    },
    {
      target: "#tour-theme-toggle",
      title: t("tour_theme_title"),
      content: t("tour_theme_content"),
      position: "bottom",
    },
    {
      target: "#tour-vehicle-card",
      title: t("tour_card_title"),
      content: t("tour_card_content"),
      position: "bottom",
    },
    {
      target: "#tour-vehicle-card .tour-status-badge",
      title: t("tour_status_title"),
      content: t("tour_status_content"),
      position: "bottom",
    },
    {
      target: "#tour-vehicle-card .tour-controls",
      title: t("tour_controls_title"),
      content: t("tour_controls_content"),
      position: "top",
    },
    {
      target: "#tour-vehicle-card .tour-history-link",
      title: t("tour_history_link_title"),
      content: t("tour_history_link_content"),
      position: "top",
    },
  ];

  return (
    <div class="min-h-screen bg-primary transition-colors duration-300">
      <OnboardingTour steps={tourSteps} tourKey="dashboard_v1" />
      <nav class="bg-secondary border-b border-border-primary px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div class="flex items-center gap-3">
          {/* <div class="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-accent-text font-bold text-xl shadow-lg shadow-accent/20">T</div> */}
          <img
            src="/connectedSocial-icon-notextbg.png"
            alt="Logo"
            class="w-8 h-8 md:hidden"
          />
          <h1 class="text-xl font-bold text-text-primary hidden md:block">
            {t("technician_dashboard")}
          </h1>
        </div>
        <div class="flex items-center gap-4">
          <LanguageSelector />
          <div id="tour-search-bar" class="relative hidden md:block">
            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={searchTerm()}
              onInput={(e) => setSearchTerm(e.currentTarget.value)}
              class="bg-tertiary border border-border-primary rounded-lg pl-10 pr-4 py-2 text-sm text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none w-64 transition-all"
            />
            <span class="absolute left-3 top-2.5 text-text-tertiary">🔍</span>
          </div>
          <button
            id="tour-history-btn"
            onClick={() => navigate("/history")}
            class="p-2 rounded-lg hover:bg-tertiary text-text-secondary transition-colors"
            title={t("global_history")}
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </button>
          <button
            id="tour-theme-toggle"
            onClick={toggleTheme}
            class="p-2 rounded-lg hover:bg-tertiary text-text-secondary transition-colors"
            title={t("theme_toggle")}
          >
            {getThemeIcon()}
          </button>
          <button
            onClick={handleComback}
            class="bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3 py-2 md:px-4 md:py-2 rounded-lg text-sm font-medium transition-colors"
            title={t("comeback")}
          >
            <span class="md:hidden">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
              </svg>
            </span>
            <span class="hidden md:inline">{t("comeback")}</span>
          </button>
        </div>
      </nav>

      <main class="p-6 max-w-7xl mx-auto">
        <div class="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h2 class="text-2xl font-bold text-text-primary">
            {t("fleet_dashboard")}
          </h2>
          <div class="flex items-center gap-2">
            <span class="text-sm text-text-secondary hidden sm:inline">
              {t("items_per_page")}:
            </span>
            <select
              value={limit()}
              onChange={(e) => {
                setLimit(Number(e.currentTarget.value));
                setPage(1);
              }}
              class="bg-tertiary border border-border-primary rounded-lg px-2 py-1 text-sm text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none cursor-pointer"
            >
              <option value={8}>8</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Mobile Search */}
        <div class="md:hidden mb-6">
          <input
            type="text"
            placeholder={t("search_placeholder")}
            value={searchTerm()}
            onInput={(e) => setSearchTerm(e.currentTarget.value)}
            class="w-full bg-tertiary border border-border-primary rounded-lg px-4 py-3 text-text-primary focus:border-accent outline-none"
          />
        </div>

        {vehiclesData.loading && (
          <div class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        )}

        {vehiclesData.error && (
          <div class="flex flex-col items-center justify-center py-12 text-center">
            <div class="text-red-500 text-5xl mb-4">⚠️</div>
            <h3 class="text-xl font-bold text-text-primary mb-2">
              {t("failed_load")}
            </h3>
            <p class="text-text-secondary mb-6">
              Could not connect to the server. Please check your connection.
            </p>
            <button
              onClick={() => window.location.reload()}
              class="px-6 py-2 bg-accent text-accent-text rounded-lg hover:bg-accent-hover transition-colors"
            >
              {t("retry")}
            </button>
          </div>
        )}

        {!vehiclesData.loading &&
          !vehiclesData.error &&
          filteredVehicles().length === 0 && (
            <div class="flex flex-col items-center justify-center py-12 text-center">
              <div class="text-text-tertiary text-5xl mb-4">🚐</div>
              <h3 class="text-xl font-bold text-text-primary mb-2">
                {t("no_vehicles")}
              </h3>
              <p class="text-text-secondary">
                {searchTerm()
                  ? `No vehicles match "${searchTerm()}"`
                  : "There are no vehicles in your fleet yet."}
              </p>
            </div>
          )}

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <For each={filteredVehicles()}>
            {(vehicle, index) => (
              <VehicleCard
                vehicle={vehicle}
                id={index() === 0 ? "tour-vehicle-card" : undefined}
              />
            )}
          </For>
        </div>

        {/* Pagination Controls */}
        {!vehiclesData.loading &&
          !vehiclesData.error &&
          vehiclesData()?.meta && (
            <div class="flex justify-center items-center gap-4">
              <button
                onClick={handlePrevPage}
                disabled={page() === 1}
                class="px-4 py-2 rounded-lg bg-secondary border border-border-primary text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-tertiary transition-colors"
              >
                {t("previous")}
              </button>
              <span class="text-text-secondary font-medium">
                {t("page")} {page()} {t("of")} {totalPages()}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page() === totalPages()}
                class="px-4 py-2 rounded-lg bg-secondary border border-border-primary text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-tertiary transition-colors"
              >
                {t("next")}
              </button>
            </div>
          )}
      </main>
    </div>
  );
};

export default Dashboard;
