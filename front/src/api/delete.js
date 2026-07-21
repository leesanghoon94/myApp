export function deleteOne(id) {
  return fetch(`/api/article/${id}`, {
    method: "DELETE",
    mode: "cors",
  }).then((resp) => resp.json());
}
