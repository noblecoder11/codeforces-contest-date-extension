document.addEventListener('DOMContentLoaded', function () {
    const fetchButton = document.getElementById('fetch-button');
    const contestInfoDiv = document.getElementById('contest-info');

    fetchButton.addEventListener('click', async function () {
        // Example contest ID to fetch; you can modify this logic to fetch dynamic contests
        const contestId = '1567'; // Replace with dynamic fetching logic or user input
        const startDate = await fetchContestStartTime(contestId);

        if (startDate) {
            contestInfoDiv.innerHTML = `Start Date: <strong>${startDate}</strong>`;
        } else {
            contestInfoDiv.innerHTML = 'Failed to fetch contest data. Please try again.';
        }
    });

    // Function to fetch contest data (reusing the one in content.js)
    async function fetchContestStartTime(contestId) {
        const apiUrl = `https://codeforces.com/api/contest.standings?contestId=${contestId}&from=1&count=1`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.status === "OK") {
                const startTimeSeconds = data.result.contest.startTimeSeconds;
                const startDate = new Date(startTimeSeconds * 1000);

                // Format the date to 'Sept 5, 2024'
                return startDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });
            } else {
                console.error("Error fetching contest data:", data.comment);
            }
        } catch (error) {
            console.error("Request failed:", error);
        }
        return null;
    }
});
