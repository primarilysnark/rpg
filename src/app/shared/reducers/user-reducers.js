const DEFAULT_USER_STATE = {
  name: '',
};

export function currentUser(state = DEFAULT_USER_STATE, action) {
  const { type } = action;

  switch (type) {
    default:
      return state;
  }
}
