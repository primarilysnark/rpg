const DEFAULT_USER_STATE = {
  id: '-1',
  name: '',
};

export function currentUser(state = DEFAULT_USER_STATE, action) {
  const { type } = action;

  switch (type) {
    default:
      return state;
  }
}
