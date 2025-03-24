"use server";

import JobSearch from "../../components/JobSearch/JobSearch";

const jobSearch = async () => {
  return (
    <>
      <div className="flex flex-row flex-wrap gap-4 mx-auto justify-center mt-2">
        {/* {posting} */}
      </div>
      <JobSearch />
    </>
  );
};

export default jobSearch;
