export function update(id, data) {
  console.log(id, data);

  return fetch(`/api/article/${id}`, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((resp) => resp.json());
}
