let resumeData = JSON.parse(localStorage.getItem("resumeData")) || {
  profile: {},
  education: [
    {
      id: "dummy",
      degreeName: null,
      description: null,
      endDate: null,
      instituteName: null,
      startDate: null,
    },
  ],
  workExp: [
    {
      companyName: null,
      position: null,
      workStartDate: null,
      workEndDate: null,
      workDesc: null,
    },
  ],
  skills: [],
};

console.log(resumeData);

function populateForm() {
  for (const key in resumeData?.profile) {
    if (resumeData?.profile.hasOwnProperty(key)) {
      const value = resumeData.profile[key];
      const inputField = document.querySelector(`#${key}`);

      if (inputField) {
        inputField.textContent = value;
      }
    }
  }
  //skills add
  const skillParent = document.querySelector(".skillsWrap");

  resumeData?.skills.forEach((element, index) => {
    if(element){

    const bgColor = index % 2 === 0 ? "#4a8adc" : "#37bc9b"; // Calculate background color

    const skillData = `<div class="skillSlider">
      <span class="">${element}</span>
      <div class="sliderContainer" style="background-color: ${bgColor}">
      </div>
    </div>`;

    skillParent.innerHTML += skillData;}
  });

  //work exp populate
  const workExpParent = document.querySelector(".workExp .workExpCont");
  resumeData?.workExp?.forEach((element, index) => {
    if (element.position != null) {
      const workData = ` <div class="workExpCard">
<div
  class="workExpCardCircle"
  style="border-color: #4a88dc"
></div>
<div
  class="workExpCardLine"
  style="border-color: #4a88dc"
></div>
<div
  class="workExpCardDetails"
  style="border-left-color: #4a88dc"
>
  <div>
    <div>
      <span style="padding: 0px 3px; outline-color: #434a54">
        ${element?.position}
      </span>
      <span>at</span>
      <span style="padding: 0px 3px; outline-color: #434a54">
       ${element?.companyName}
      </span>
    </div>
    <p style="padding: 0px 3px; outline-color: #434a54">
      ${element?.workStartDate}-${element?.workEndDate}
    </p>
  </div>
  <p style="padding: 0px 3px; outline-color: #434a54">
     ${element?.workDesc}.
  </p>
</div>
</div>`;
      workExpParent.innerHTML += workData;
    }
  });

  //edu populate
  const educationParent = document.querySelector(".edu");
  resumeData?.education?.forEach((element, index) => {
    if (element.degreeName != null) {
      const eduData = ` <div class="workExpCard">
    <div
      class="workExpCardCircle"
      style="border-color: #37bc9b"
    ></div>
    <div
      class="workExpCardLine"
      style="border-color: #37bc9b"
    ></div>
    <div
      class="workExpCardDetails"
      style="border-left-color: #37bc9b"
    >
      <div>
        <div>
          <span style="padding: 0px 3px; outline-color: #434a54">
           ${element.degreeName}
          </span>
          <span>from</span>
          <span style="padding: 0px 3px; outline-color: #434a54">
            ${element.instituteName}
          </span>
        </div>
        <p style="padding: 0px 3px; outline-color: #434a54">
          ${element.startDate} - ${element.endDate}
        </p>
      </div>
      <p style="padding: 0px 3px; outline-color: #434a54">
        ${element.description}
      </p>
    </div>
  </div>`;
      educationParent.innerHTML += eduData;
    }
  });
}
populateForm();
