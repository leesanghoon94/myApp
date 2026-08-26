export function readAll() {
  return () =>
    fetch(`http://localhost:3333/api/article`)
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
  return () =>
    fetch(`http://localhost:3333/api/article/${id}`).then((res) => res.json());
}
