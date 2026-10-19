export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('redux_pizza_app');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('redux_pizza_app', serializedState);
  } catch (err) {
    // Ignore write errors
  }
};