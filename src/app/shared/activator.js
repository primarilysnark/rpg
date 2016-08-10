export function activate({ components }, activationArgs) {
  return Promise.all(components.map(component => {
    if (component.activate) {
      return component.activate(...activationArgs);
    } else if (component.WrappedComponent && component.WrappedComponent.activate) {
      return component.WrappedComponent.activate(...activationArgs);
    }

    return Promise.resolve();
  }));
}
