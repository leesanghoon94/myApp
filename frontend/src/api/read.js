export function readAll() {
  return () =>
    fetch(`/api/article`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          return data.reverse();
        }
        console.warn(`readAll(): unexcepted response`, data);
        return [];
      });
}

export function readOne(id) {
  return () => fetch(`/api/article${id}`).then((res) => res.json());
}
