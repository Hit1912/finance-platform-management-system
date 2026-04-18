import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
    currency: string;
    language: string;
    showDecimals: boolean;
    emailReports: boolean;
    pushNotifications: boolean;
    twoFactorAuth: boolean;
    loginAlerts: boolean;
    dateFormat: string;
    weekStart: string;
    budgetThreshold: number;
    monthlyBudgetGoal: number;
    searchTerm: string;
}

const initialState: SettingsState = {
    currency: "INR",
    language: "en",
    showDecimals: true,
    emailReports: true,
    pushNotifications: false,
    twoFactorAuth: false,
    loginAlerts: true,
    dateFormat: "DD/MM/YYYY",
    weekStart: "monday",
    budgetThreshold: 5000,
    monthlyBudgetGoal: 50000,
    searchTerm: "",
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setCurrency: (state, action: PayloadAction<string>) => {
            state.currency = action.payload;
        },
        setLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
        },
        toggleShowDecimals: (state) => {
            state.showDecimals = !state.showDecimals;
        },
        toggleEmailReports: (state) => {
            state.emailReports = !state.emailReports;
        },
        togglePushNotifications: (state) => {
            state.pushNotifications = !state.pushNotifications;
        },
        toggleTwoFactorAuth: (state) => {
            state.twoFactorAuth = !state.twoFactorAuth;
        },
        toggleLoginAlerts: (state) => {
            state.loginAlerts = !state.loginAlerts;
        },
        setDateFormat: (state, action: PayloadAction<string>) => {
            state.dateFormat = action.payload;
        },
        setWeekStart: (state, action: PayloadAction<string>) => {
            state.weekStart = action.payload;
        },
        setBudgetThreshold: (state, action: PayloadAction<number>) => {
            state.budgetThreshold = action.payload;
        },
        setMonthlyBudgetGoal: (state, action: PayloadAction<number>) => {
            state.monthlyBudgetGoal = action.payload;
        },
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
    },
});

export const {
    setCurrency,
    setLanguage,
    toggleShowDecimals,
    toggleEmailReports,
    togglePushNotifications,
    toggleTwoFactorAuth,
    toggleLoginAlerts,
    setDateFormat,
    setWeekStart,
    setBudgetThreshold,
    setMonthlyBudgetGoal,
    setSearchTerm,
} = settingsSlice.actions;

export default settingsSlice.reducer;
