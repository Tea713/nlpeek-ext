export async function getSummary(content: string, length: string) {
  const url: string = "";
  const data = {
    content: content,
    length: length,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.summary;
  } catch (error) {
    console.error("Error: ", error);
  }
}
