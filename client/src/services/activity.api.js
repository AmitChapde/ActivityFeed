const API = import.meta.env.VITE_API_URL;

export const fetchActivitiesAPI = async (cursor) => {
  let url = `${API}?limit=10`;

  if (cursor) {
    url += `&cursor=${encodeURIComponent(cursor)}`;
  }

  console.log("Request URL:", url);

  const res = await fetch(url, {
    headers: { "x-tenant-id": "tenant_1" },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch activities");
  }

  return res.json();
};

export const createActivityAPI = async (data) => {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-tenant-id": "tenant_1"
    },
    body: JSON.stringify(data)
  });

  const json = await res.json(); 

  if (!res.ok) {
    throw new Error(json.error || "Request failed");
  }

  return json;
};
