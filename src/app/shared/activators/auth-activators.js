export function requireAnonymousUser(store, routerState, navigate) {
  return new Promise(resolve => {
    const { currentUser } = store.getState();

    resolve(currentUser);
  })
    .then(currentUser => {
      if (currentUser.id !== -1) {
        navigate('/campaigns');
      }
    });
}

export function requireAuthenticatedUser(store, routerState, navigate) {
  return new Promise(resolve => {
    const { currentUser } = store.getState();

    resolve(currentUser);
  })
    .then(currentUser => {
      if (currentUser.id === -1) {
        navigate('/');
      }
    });
}
