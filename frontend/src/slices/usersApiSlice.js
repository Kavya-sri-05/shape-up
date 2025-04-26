import { apiSlice } from "./apiSlice";

const USERS_URL = "/api/users";
const USER_STATUS_URL = "/api/user/status";
const USER_MEAL_PLAN_URL = "/api/user/meal-plan";
const USER_MEAL_PLANS_URL = "/api/user/meal-plans";
const USER_MEDICATIONS_URL = "/api/user/medications";
const USER_WATER_INTAKE_URL = "/api/users/water-intake";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // User endpoints
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),

    // User status endpoints
    updateStatus: builder.mutation({
      query: (data) => ({
        url: `${USER_STATUS_URL}`,
        method: "PUT",
        body: data,
      }),
    }),

    // User meal plan endpoints
    getAllMealPlans: builder.query({
      query: () => ({
        url: USER_MEAL_PLANS_URL,
        credentials: 'include',
      }),
      providesTags: ['MealPlan'],
    }),
    createMealPlan: builder.mutation({
      query: (data) => ({
        url: USER_MEAL_PLAN_URL,
        method: "POST",
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['MealPlan'],
    }),
    updateMealPlan: builder.mutation({
      query: (data) => ({
        url: USER_MEAL_PLAN_URL,
        method: "PUT",
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['MealPlan'],
    }),
    deleteMealPlan: builder.mutation({
      query: (date) => ({
        url: `${USER_MEAL_PLAN_URL}/${date}`,
        method: "DELETE",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['MealPlan'],
    }),

    // User Water intake endpoints
    createWaterIntake: builder.mutation({
      query: (data) => ({
        url: USER_WATER_INTAKE_URL,
        method: "POST",
        body: data,
        credentials: 'include',
      }),
    }),

    updateWaterIntake: builder.mutation({
      query: (data) => ({
        url: USER_WATER_INTAKE_URL,
        method: "PUT",
        body: data,
        credentials: 'include',
      }),
    }),

    // Medication endpoints
    getAllMedications: builder.query({
      query: () => ({
        url: USER_MEDICATIONS_URL,
        credentials: 'include',
      }),
      providesTags: ['Medication'],
    }),
    getMedication: builder.query({
      query: (id) => ({
        url: `${USER_MEDICATIONS_URL}/${id}`,
        credentials: 'include',
      }),
      providesTags: ['Medication'],
    }),
    createMedication: builder.mutation({
      query: (data) => ({
        url: USER_MEDICATIONS_URL,
        method: "POST",
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['Medication'],
    }),
    updateMedication: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${USER_MEDICATIONS_URL}/${id}`,
        method: "PUT",
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['Medication'],
    }),
    deleteMedication: builder.mutation({
      query: (id) => ({
        url: `${USER_MEDICATIONS_URL}/${id}`,
        method: "DELETE",
        credentials: 'include',
      }),
      invalidatesTags: ['Medication'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useUpdateStatusMutation,
  useGetAllMealPlansQuery,
  useCreateMealPlanMutation,
  useUpdateMealPlanMutation,
  useDeleteMealPlanMutation,
  useCreateWaterIntakeMutation,
  useUpdateWaterIntakeMutation,
  useGetAllMedicationsQuery,
  useGetMedicationQuery,
  useCreateMedicationMutation,
  useUpdateMedicationMutation,
  useDeleteMedicationMutation,
} = userApiSlice;
