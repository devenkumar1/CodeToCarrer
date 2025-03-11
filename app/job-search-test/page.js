import LinkedIn from "linkedin-jobs-api"
const JobSearchTest = async ()=>{
    
    const searchForm = async(formData)=>{
        "use server"
        const queryOptions = {
            keyword: formData.get('keyword'),
            location: formData.get('location'),
            dateSincePosted: 'past Week',
            jobType: 'full time',
            remoteFilter: 'remote',
            salary: '100000',
            experienceLevel: formData.get('experienceLevel'),
            limit: '10',
            page: "0",
          };
          console.log(queryOptions)
          const response = await LinkedIn.query(queryOptions);
         
          console.log(response)

    }
    return(
        <>
         <div className="flex items-center justify-center p-4">
        <form
          action={searchForm} // Now handled in client-side
          className="flex flex-col md:flex-row gap-4 bg-slate-200 dark:bg-gray-800 p-4 rounded-lg shadow-md w-full max-w-3xl"
        >
          <input
            type="text"
            name="keyword"
            placeholder="Job title (e.g. Software Engineer)"
            className="border p-2 rounded-md flex-1 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="location"
            placeholder="Location (e.g. India, USA)"
            className="border p-2 rounded-md flex-1 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="experienceLevel"
            className="border p-2 rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Level</option>
            <option value="entry level">Entry Level</option>
            <option value="mid level">Mid Level</option>
            <option value="senior level">Senior Level</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </form>
        </div>
        </>
    )
}
export default JobSearchTest;