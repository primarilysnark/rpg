const DEFAULT_EDITOR_STATE = {
  name: '',
};

export function editor(state = DEFAULT_EDITOR_STATE, action) {
  const { type } = action;

  switch (type) {
    default:
      return state;
  }
}
