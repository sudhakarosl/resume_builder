const inputNavCircles = document.querySelectorAll(".inputNav_circle");
const forms = document.querySelectorAll(".hidden-form");
const nextButtons = document.querySelectorAll(".next-button");
const submitButtons = document.querySelectorAll(".submit-button");
let current_step = Number(localStorage.getItem("current_step")) || 0;
let education_step = Number(localStorage.getItem("education_step")) || 0;
let workexp_step = Number(localStorage.getItem("workexp_step")) || 0;
let education_edit = false;
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

forms[current_step].style.display = "block";
inputNavCircles[current_step].classList.add("selected");

inputNavCircles.forEach((circle, index) => {
  circle.addEventListener("click", () => {
    const currentStep = circle.textContent;
    localStorage.setItem("current_step", currentStep - 1);
    forms.forEach((form) => {
      form.style.display = "none";
    });

    forms[index].style.display = "block";

    inputNavCircles.forEach((c) => c.classList.remove("selected"));
    circle.classList.add("selected");
  });
});
function goToNextStep() {
  forms.forEach((nextButton, index) => {
    forms[index].style.display = "none";
    inputNavCircles[index].classList.remove("selected");
  });

  current_step = parseInt(current_step, 10);
 

  if (current_step < forms.length) {
    forms[current_step].style.display = "block";
    inputNavCircles[current_step].classList.add("selected");
  }
}

const addSkillBtn = document.getElementById("addSkillBtn");

function addSkill() {
  console.log("first");
  const skillInput = document.getElementById("skillInput");
  const skillList = document.getElementById("skillList");
  const skillText = skillInput.value.trim();

  if (skillText === "") {
    alert("Please enter a skill.");
    return;
  }

  const listItem = document.createElement("li");
  listItem.textContent = skillText;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.onclick = function () {
    skillList.removeChild(listItem);
  };

  listItem.appendChild(deleteButton);
  skillList.appendChild(listItem);

  skillInput.value = "";
}

function handleSubmit() {
  event.preventDefault();
  const form = event.target;
  const name = form.name;
  const submitterDetails = event.submitter.value;
  const formDataObject = {};
  const formData = new FormData(form);

  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });

  if (name === "education") {
    current_step = 2;
  } else if (name === "workExp") {
    current_step = 3;
  }
  const submitButton = document.getElementById(`${form.id}submit`);
  const originalButtonText = submitButton.textContent;

  localStorage.setItem("current_step", current_step);

  if (name === "profile") {
    current_step = 1;
    localStorage.setItem("current_step", current_step);

    resumeData[name] = formDataObject;
    saveInLocalStorage();
    goToNextStep();
  } else if (name === "skills") {
    const skillsValue = formDataObject.skill;
    const skillsArray = skillsValue.split(",").map((skill) => skill.trim());
    resumeData[name] = skillsArray;
    saveInLocalStorage();
    if (submitterDetails === "save&add") {
      const submitButton = document.getElementById(`${form.id}submit`);
      submitButton.textContent = "Saved👏👏";
    }
  } else {
    const obj =
      name === "education"
        ? {
            empty: "true",
            degreeName: null,
            description: null,
            endDate: null,
            instituteName: null,
            startDate: null,
          }
        : name === "workExp"
        ? {
            empty: "true",
            companyName: null,
            position: null,
            workStartDate: null,
            workEndDate: null,
            workDesc: null,
          }
        : {};

    let step =
      name === "education"
        ? education_step
        : name === "workExp"
        ? workexp_step
        : null;

    if (submitterDetails === "save&add" && name !== "profile") {
      resumeData[name][step] = formDataObject;
      submitButton.textContent = "Saved👏👏";
      const lastObject = resumeData[name][resumeData[name].length - 1];
      if (lastObject?.empty != "true") resumeData[name].push(obj);
      saveInLocalStorage();
    } else if (submitterDetails === "save&next" && name !== "profile") {
      resumeData[name][step] = formDataObject;
      saveInLocalStorage();
      goToNextStep();
    }
  }
  setTimeout(() => {
    submitButton.textContent = originalButtonText;
    if (
      submitterDetails === "save&add" &&
      name !== "profile" &&
      name != "skills"
    ) {
      form.reset();
      if (name == "education") {
        education_step = resumeData?.education.length - 1;
        localStorage.setItem("education_step", education_step);
      }
      if (name == "workExp") {
        workexp_step = resumeData?.workExp.length - 1;
        localStorage.setItem("workexp_step", workexp_step);
      }
      circleGenerator(name);
    }
  }, 500);
}

function saveInLocalStorage() {
  localStorage.setItem("resumeData", JSON.stringify(resumeData));
}

function populateForm() {
  for (const key in resumeData?.profile) {
    if (resumeData?.profile.hasOwnProperty(key)) {
      const value = resumeData.profile[key];
      const inputField = document.querySelector(`[name="${key}"]`);

      if (inputField) {
        inputField.value = value;
      }
    }
  }
  const skillInput = document.querySelector('input[name="skill"]');

  const skillsArray = resumeData.skills;

  const skillValue = skillsArray.join(", ");

  skillInput.value = skillValue;
  showEduFormData(education_step, "education");
  showEduFormData(workexp_step, "workExp");
  circleGenerator("education");
  circleGenerator("workExp");
}
function showEduFormData(index, name) {
  for (const key in resumeData?.[name][index]) {
    if (resumeData?.[name][index].hasOwnProperty(key)) {
      const value = resumeData?.[name][index][key];
      const inputField = document.querySelector(`[name="${key}"]`);

      if (inputField) {
        inputField.value = value;
      }
    }
  }
}

function handleDelete(name) {
  const index =
    name == "workExp"
      ? workexp_step
      : name == "education"
      ? education_step
      : null;
  const obj =
    name === "education"
      ? {
          empty: "true",
          degreeName: null,
          description: null,
          endDate: null,
          instituteName: null,
          startDate: null,
        }
      : name === "workExp"
      ? {
          empty: "true",
          companyName: null,
          position: null,
          workStartDate: null,
          workEndDate: null,
          workDesc: null,
        }
      : {};
  if (index != null) {
    resumeData?.[name].splice(index, 1);

    if (resumeData?.[name].length == 0) resumeData?.[name].push(obj);

    saveInLocalStorage();
    if (name == "workExp") {
      workexp_step = resumeData?.workExp.length - 1;
      localStorage.setItem("workexp_step", workexp_step);
    }
    if (name == "education") {
      education_step = resumeData?.education.length - 1;
      localStorage.setItem("education_step", education_step);
    }
  }
  populateForm();
}
function eduNavClick(index, name) {
  education_edit = true;
  showEduFormData(index, name);

  if (name === "education") {
    education_step = index;
    localStorage.setItem("education_step", education_step);
  } else if (name === "workExp") {
    workexp_step = index;
    localStorage.setItem("workexp_step", workexp_step);
  }

  circleGenerator(name);
}

function circleGenerator(name) {
  console.log("name", name);
  let eduParentNav = "";
  if (name == "education") {
    eduParentNav = document.querySelector(".eduNav");
  } else if (name == "workExp") {
    eduParentNav = document.querySelector(".eduNav.workExp");
  }
  eduParentNav.innerHTML = "";
  const lineElement = document.createElement("div");
  lineElement.className = "eduNav_line";
  const education =
    name == "education"
      ? resumeData?.education
      : name == "workExp"
      ? resumeData?.workExp
      : [];
  let step =
    name == "education"
      ? education_step
      : name == "workExp"
      ? workexp_step
      : null;

  education.forEach((item, i) => {
    const circleDiv = document.createElement("div");
    circleDiv.addEventListener("click", () => eduNavClick(i, name));
    circleDiv.className = "eduNav_circle";
    circleDiv.textContent = i + 1;
    eduParentNav.appendChild(circleDiv);

    if (i == step) {
      circleDiv.style.backgroundColor = "#5591df";
      circleDiv.style.color = "#ffffff";
    }
    if (step == -1) {
      if (i === education.length - 1) {
        circleDiv.style.color = "#ffffff";

        circleDiv.style.backgroundColor = "#5591df";
      }
    }
  });

  eduParentNav.appendChild(lineElement);
}

function handlePreview() {
  console.log("first");
  window.location.href = "resume.html";
}

populateForm();
