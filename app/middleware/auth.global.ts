export default defineNuxtRouteMiddleware((to) => {
  if (!import.meta.client) return
  const authed = !!localStorage.getItem('chms_token')
  if (!authed && to.path !== '/login') return navigateTo('/login')
  if (authed && to.path === '/login') return navigateTo('/')
})
