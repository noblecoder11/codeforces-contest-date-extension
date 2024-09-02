// Function to extract contest ID from href attribute
function getContestIdFromHref(href) {
  const match = href.match(/\/contest\/(\d+)/);
  return match ? match[1] : null;
}

// Function to fetch contest data using the Codeforces API
async function fetchContestStartTime(contestId) {
  const apiUrl = `https://codeforces.com/api/contest.standings?contestId=${contestId}&from=1&count=1`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status === "OK") {
      const startTimeSeconds = data.result.contest.startTimeSeconds;
      const startDate = new Date(startTimeSeconds * 1000); // Convert Unix timestamp to JavaScript Date
      return startDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }); // Convert to readable date format
    } else {
      console.error("Error fetching contest data:", data.comment);
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
  return null;
}

// Selecting the element using the provided JavaScript path
const targetElement = document.querySelector("#sidebar > div:nth-child(1) > table > tbody > tr:nth-child(1) > th > a");

if (targetElement) {
  const contestId = getContestIdFromHref(targetElement.getAttribute("href"));

  if (contestId) {
    // Fetch and display the contest start date when hovering over the element
    targetElement.addEventListener('mouseenter', async function () {
      const startDate = await fetchContestStartTime(contestId);
      if (startDate) {
        targetElement.setAttribute('title', startDate);
      } else {
        targetElement.setAttribute('title', 'Date not available');
      }
    });

    // Remove the title attribute when the mouse leaves
    targetElement.addEventListener('mouseleave', function () {
      targetElement.removeAttribute('title');
    });
  } else {
    console.error("Could not extract contest ID from href.");
  }
}
