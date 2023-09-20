document.addEventListener('DOMContentLoaded', function () {
    fetch('data.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n');
            const tableBody = document.querySelector('#leaderboard tbody');

            // Create an array to store leaderboard data objects
            const leaderboardData = [];

            for (let i = 1; i < rows.length; i++) {
                const rowData = rows[i].split(',');
                if (rowData.length === 11) {
                    const [nameWithQuotes, email, college, enrollmentDate, status, profile, coursesCompleted, skillBadges, genAIGames, allPathways, redemptionStatus] = rowData;
                    if (status !== 'All Good') continue; // Skip if the student is not enrolled

                    // Remove double quotes from the name
                    const name = nameWithQuotes.replace(/"/g, '');

                    // Convert redemption status to lowercase and remove whitespace
                    const cleanedRedemptionStatus = redemptionStatus.toLowerCase().replace(/\s/g, '');

                    // Calculate rank based on the number of courses completed
                    leaderboardData.push({
                        rank: parseInt(coursesCompleted) + parseInt(skillBadges) + parseInt(genAIGames),
                        name,
                        coursesCompleted: parseInt(coursesCompleted),
                        skillBadges: parseInt(skillBadges),
                        genAIGames: parseInt(genAIGames),
                        redemptionStatus: cleanedRedemptionStatus === 'yes' ? '<span class="green-tick">&#10004;</span>' : '<span class="red-cross">&#10008;</span>',
                    });
                }
            }

            // Sort leaderboard data by rank (number of courses completed)
            leaderboardData.sort((a, b) => b.rank - a.rank);

            // Populate the leaderboard table
            leaderboardData.forEach((data, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${data.name}</td>
                    <td>${data.redemptionStatus}</td>
                    <td>${data.coursesCompleted}</td>
                    <td>${data.skillBadges}</td>
                    <td>${data.genAIGames}</td>
                    
                `;
                tableBody.appendChild(row);
            });

            // Search functionality
            const searchInput = document.querySelector('#search');
            searchInput.addEventListener('input', function () {
                const searchQuery = searchInput.value.toLowerCase();
                const filteredData = leaderboardData.filter(data => data.name.toLowerCase().includes(searchQuery));
                renderTable(filteredData);
            });

            // Initial rendering of the full leaderboard
            renderTable(leaderboardData);

            // Function to render the table based on data
            function renderTable(data) {
                tableBody.innerHTML = '';
                data.forEach((data, index) => {
                    if (data.coursesCompleted + data.skillBadges + data.genAIGames == 9){
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><img src="badge.png" width=20px></td>
                        <td>${data.name}</td>
                        <td>${data.redemptionStatus}</td>
                        <td>${data.coursesCompleted}</td>
                        <td>${data.skillBadges}</td>
                        <td>${data.genAIGames}</td>
                        
                    `;
                    tableBody.appendChild(row);
                    }
                    else {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${data.name}</td>
                            <td>${data.redemptionStatus}</td>
                            <td>${data.coursesCompleted}</td>
                            <td>${data.skillBadges}</td>
                            <td>${data.genAIGames}</td>
                            
                        `;
                        tableBody.appendChild(row);
                    }
                });
            }
        })
        .catch(error => console.error('Error:', error));
});