export function deleteOne(id) {
  return fetch(`http://localhost:3333/api/article/${id}`, {
    method: "DELETE",
    mode: "cors",
  }).then((resp) => resp.json());
}
