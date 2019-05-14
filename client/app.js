///////////// Loan Inquiry constructor ES6 //////////////////////
class LoanInquiry {
  constructor(created, amount, interest, years, monthlyPayment, totalPayment, totalInterest) {
    // this.inquiryId = inquiryId;
    this.created = created;
    this.amount = amount;
    this.interest = interest;
    this.years = years;
    this.monthlyPayment = monthlyPayment;
    this.totalPayment = totalPayment;
    this.totalInterest = totalInterest
  }

}

//////////////// UI Constructor ES6 ////////////////////

class UI {
  addInquiryToList(loanInquiry) {
    // console.log(loanInquiry.amount);
    const list = document.getElementById('inquiry-list');
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="display: none">${loanInquiry._id}</td>
      <td>\$${loanInquiry.amount}.00</td>
      <td>${loanInquiry.interest}%</td>
      <td>${loanInquiry.years}</td>
      <td>${loanInquiry.monthlyPayment}</td>
      <td>${loanInquiry.totalPayment}</td>
      <td>${loanInquiry.totalInterest}</td>
      <td><span id="delete" class="delete">&times;</span></td>
      <td><input type="checkbox" class="checkbox" style="margin-left: 25px"></td>
    `;

    list.append(row);

    row.addEventListener('click', function (e) {
      if (e.target.className === 'delete') {
        Store.removeInquiry(e.target.parentElement.parentElement.firstElementChild.innerHTML);
        e.target.parentElement.parentElement.remove();
        // console.log(e.target);
        listCheck(e);
        e.preventDefault();

      }

      if (e.target.className === 'checkbox') {
        let checked = document.querySelectorAll('.checkbox');
        let deleteBtn = document.getElementById('delete-button');
        let clearBtn = document.getElementById('clear-checked-button');
        for (let i = 0; i <= checked.length - 1; i++) {
          if (checked[i].checked === true) {
            deleteBtn.style.backgroundColor = 'pink';
            deleteBtn.style.color = 'rgb(85, 85, 85)';
            deleteBtn.onmouseover = () => {
              mouseOverDelete()
            };
            deleteBtn.onmouseout = () => {
              mouseOutDelete()
            };
            clearBtn.style.backgroundColor = 'lightgreen';
            clearBtn.style.color = 'rgb(85, 85, 85)';
            clearBtn.onmouseover = () => {
              mouseOverClear()
            };
            clearBtn.onmouseout = () => {
              mouseOutClear()
            };
            break;
          } else {
            deleteBtn.style.backgroundColor = 'rgb(85, 85, 85)';
            deleteBtn.style.color = 'white';
            clearBtn.style.backgroundColor = 'rgb(85, 85, 85)';
            clearBtn.style.color = 'white';
            deleteBtn.onmouseover = null;
            deleteBtn.onmouseout = null;
            clearBtn.onmouseover = null;
            clearBtn.onmouseout = null;
          }
        }

      }

    });
  }
}

class Store {
  static getInquiries() {
    let localInquiries = localStorage.getItem('inquiries');

    if (localInquiries != [] || localInquiries != null) {
      console.log(localInquiries);
    }
    // Create the XHR Object
    const xhr = new XMLHttpRequest();

    //Open the connection
    xhr.open('GET', 'https://cormack-loancalculator.herokuapp.com/api/inquiries', true);

    let inquiries;
    xhr.onload = function () {
      if (this.status === 200) {
        inquiries = JSON.parse(this.responseText);
        if (inquiries != []) {
          let ui = new UI();
          for (let i = 0; i < inquiries.length; i++) {
            ui.addInquiryToList(inquiries[i]);
            showTable();
          }
          localStorage.setItem('inquiries', JSON.stringify(inquiries));
        }
      }
    }
    //Don't forget to SEND the request
    xhr.send();

  }

  static addInquiry(inquiry) {
    let ui = new UI();
    const inquiries = JSON.parse(localStorage.getItem('inquiries'));
    // if (inquiries != []) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://cormack-loancalculator.herokuapp.com/api/inquiries', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onload = function () {
      ui.addInquiryToList(JSON.parse(this.response));
      inquiries.push(this.response);
      localStorage.setItem('inquiries', JSON.stringify(inquiries));
    };
    xhr.send(JSON.stringify(inquiry));
    // }
  }

  static removeInquiry(inquiryId) {
    let inquiries;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://cormack-loancalculator.herokuapp.com/api/inquiries', true);
    xhr.onload = function () {
      if (this.status === 200) {
        inquiries = JSON.parse(this.responseText);
        if (typeof (inquiryId) == 'string') {
          console.log('inquiryId is a STRING');
          for (let i = 0; i < inquiries.length; i++) {
            if (inquiries[i]._id == inquiryId) {
              let xhr = new XMLHttpRequest();
              xhr.open('DELETE', `https://cormack-loancalculator.herokuapp.com/api/inquiries/${inquiries[i]._id}`, true);
              xhr.onload = function (response) {
                console.log(response.target.responseText);
              }
              xhr.send(inquiries[i]);
              inquiries.splice(i, 1);
              break;
            }
          }
        } else {
          console.log('inquiryId is an ARRAY');
          for (let i = 0; i < inquiries.length; i++) {
            for (let k = 0; k < inquiryId.length; k++) {
              if (inquiries[i]._id == inquiryId[k]) {
                let xhr = new XMLHttpRequest();
                xhr.open('DELETE', `https://cormack-loancalculator.herokuapp.com/api/inquiries/${inquiries[i]._id}`, true);
                xhr.onload = function (response) {
                  console.log(response.target.responseText);
                }
                xhr.send(inquiries[i]);
                inquiries.splice(i, 1);
              }
            }
          }
        };
      }
      localStorage.setItem('inquiries', JSON.stringify(inquiries));

    }
    xhr.send();
  }

  static removeAllInquiries() {
    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', 'https://cormack-loancalculator.herokuapp.com/api/inquiries', true);
    xhr.onload = function (response) {
      console.log(response.target.responseText);
    }
    xhr.send();
  }

  static checkInquiries() {
    let inquiries = Store.getInquiries();
    if (inquiries == 0) {
      return 0;
    } else {
      let maxNum = 0;
      for (let i = 0; i < inquiries.length; i++) {
        let number = Number(inquiries[i].inquiryNumber);
        if (number >= maxNum) {
          maxNum = number;
        }
      }
      return maxNum;
    }
  }
}

document.getElementById('loan-form').addEventListener('submit', function (e) {
  document.getElementById('results').style.display = 'none';
  calculateResults();

  e.preventDefault();
})

function calculateResults() {

  // const inquiryNumber = Store.checkInquiries() + 1;
  const created = (new Date()).toString();
  const amount = document.getElementById('amount');
  const interest = document.getElementById('interest');
  const years = document.getElementById('years');

  const monthlyPayment = document.getElementById('monthly-payment');
  const totalPayment = document.getElementById('total-payment');
  const totalInterest = document.getElementById('total-interest');


  const principal = parseFloat(amount.value);
  // console.log(principal);
  const calculatedInterest = parseFloat(interest.value) / 100 / 12;
  const calculatedPayments = parseFloat(years.value) * 12;

  const x = Math.pow(1 + calculatedInterest, calculatedPayments);
  const monthly = (principal * x * calculatedInterest) / (x - 1);


  if (isFinite(monthly)) {
    // document.getElementById('loading').style.display = 'block';
    monthlyPayment.value = "$" + monthly.toFixed(2);
    totalPayment.value = "$" + (monthly * calculatedPayments).toFixed(2);
    totalInterest.value = "$" + ((monthly * calculatedPayments) - principal).toFixed(2);
    amount.disabled = true;
    interest.disabled = true;
    years.disabled = true;
    document.getElementById('calcBtn').disabled = true;
    const loanInquiry = new LoanInquiry(created, amount.value, interest.value, years.value, monthlyPayment.value, totalPayment.value, totalInterest.value);

    const ui = new UI();
    modal();
    if (document.getElementById('table').style.display != 'block') {
      setTimeout(function () {
        showResults(loanInquiry), showTable()
      }, 500);
    } else {
      setTimeout(function () {
        showResults(loanInquiry);
      }, 500);
    }

    Store.addInquiry(loanInquiry);
  } else {
    showError('Please Check Your Numbers!  Or...');
  }
}

function showError(error) {
  const errorDiv = document.createElement('div');

  const card = document.querySelector('.card');
  const heading = document.querySelector('.heading');

  errorDiv.className = 'alert alert-danger';

  errorDiv.appendChild(document.createTextNode(error));
  const randomCat = document.createElement('button');
  randomCat.id = 'cat-button';
  randomCat.className = 'btn btn-outline-success';
  randomCat.addEventListener('click', showCat);
  randomCat.innerHTML = 'See a Cat!';


  errorDiv.appendChild(randomCat);

  card.insertBefore(errorDiv, heading);

  setTimeout(clearError, 3000);
}

function clearError() {
  document.querySelector('.alert').remove();
  const modal = document.getElementById('modal');
  if (modal.style.display == "") {
    document.getElementById('amount').focus();
  }
}

function showCat() {

  ///////////////  AJAX  below /////////////////
  // const xhr = new XMLHttpRequest();

  // xhr.open('GET', 'https://aws.random.cat/meow');

  // xhr.onloadend = function() {
  //   let response;
  //   if (this.status != 200) {
  //     response = 'Sorry...No Cats Today!';
  //   } else {
  //     response = JSON.parse(this.responseText);      
  //   }
  //   catModal(response);
  // }
  // xhr.send();


  //////////////////////  Fetch below /////////////////////
  fetch('https://aws.random.cat/meow')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      catModal(data);
    })
}

function showResults() {
  document.getElementById('results').style.display = 'block';
  document.getElementById('clear-form-btn').focus();
  document.getElementById('clear-form').addEventListener('submit', clearForm)
  // setTimeout(modal, 1000);
}

function clearForm(e) {
  document.getElementById('results').style.display = 'none';
  document.getElementById('amount').value = '';
  document.getElementById('interest').value = '';
  document.getElementById('years').value = '';
  document.getElementById('amount').disabled = false;
  document.getElementById('interest').disabled = false;
  document.getElementById('years').disabled = false;
  document.getElementById('calcBtn').removeAttribute('disabled');
  document.getElementById('amount').focus();
  // console.log(e);
  e.preventDefault();
}

function showTable() {
  document.getElementById('table').style.display = 'block';
  document.getElementById('clear-list').addEventListener('click', clearList);
  document.getElementById('delete-button').addEventListener('click', deleteChecked);
  document.getElementById('clear-checked-button').addEventListener('click', clearChecked);


}

function clearList(e) {

  swal({
      title: "Are you sure you want to clear the entire list?",
      text: "Once deleted, you will not be able to recover your inquiries!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        let list = document.getElementById('inquiry-list');
        let child = list.lastElementChild;
        while (child) {
          list.removeChild(child);
          child = list.lastElementChild;
        };
        document.getElementById('table').style.display = 'none';
        localStorage.setItem('inquiries', '[]');
        Store.removeAllInquiries();
        clearForm(e);
        swal("Your inquiries have been cleared....", {
          icon: "success",
        });
      } else {
        swal("Nothing cleared or deleted!");
      }
    });

}

function mouseOverDelete() {
  document.getElementById('delete-button').style.backgroundColor = 'red';
}

function mouseOutDelete() {
  document.getElementById('delete-button').style.backgroundColor = 'pink';
}

function mouseOverClear() {
  document.getElementById('clear-checked-button').style.backgroundColor = 'green';
}

function mouseOutClear() {
  document.getElementById('clear-checked-button').style.backgroundColor = 'lightgreen';
}

function deleteChecked(e) {
  let allChecked = [];
  let checked = document.querySelectorAll('.checkbox');
  let deleteBtn = document.getElementById('delete-button');
  let clearBtn = document.getElementById('clear-checked-button');
  for (let i = 0; i < checked.length; i++) {
    if (checked[i].checked === true) {
      allChecked.push(checked[i].parentElement.parentElement.firstElementChild.innerHTML);
      checked[i].parentElement.parentElement.remove();
    }
  }
  Store.removeInquiry(allChecked);
  listCheck(e);

  deleteBtn.onmouseover = null;
  deleteBtn.onmouseout = null;
  deleteBtn.style.backgroundColor = 'rgb(85, 85, 85)';
  deleteBtn.style.color = 'white';
  clearBtn.onmouseover = null;
  clearBtn.onmouseout = null;
  clearBtn.style.backgroundColor = 'rgb(85, 85, 85)';
  clearBtn.style.color = 'white';
  document.getElementById('amount').focus();

  e.preventDefault();

}

function clearChecked() {
  let checked = document.querySelectorAll('.checkbox');
  let deleteBtn = document.getElementById('delete-button');
  let clearBtn = document.getElementById('clear-checked-button');
  checked.forEach(element => {
    element.checked = false;
  });
  document.getElementById('amount').focus();
  deleteBtn.onmouseover = null;
  deleteBtn.onmouseout = null;
  deleteBtn.style.backgroundColor = 'rgb(85, 85, 85)';
  deleteBtn.style.color = 'white';
  clearBtn.onmouseover = null;
  clearBtn.onmouseout = null;
  clearBtn.style.backgroundColor = 'rgb(85, 85, 85)';
  clearBtn.style.color = 'white';
}

function listCheck(e) {
  const listCheck = document.querySelectorAll('tr');
  if (listCheck.length <= 1) {
    localStorage.removeItem('inquiries');
    Store.removeAllInquiries();
    document.getElementById('table').style.display = 'none';
    clearForm(e);
    e.preventDefault();
  }
}

//Loader Modal
function modal() {
  // document.getElementById('content').innerHTML = `${href ='./src/content.html'}`
  document.querySelector('.modal-content').innerHTML = `
  <img src="img/loader.gif" alt="" style="height: 500px">
  <p id="content">CALCULATING NOW.....</p>
  `;

  document.getElementById('modal').style.display = 'block';
  // document.getElementById('x').addEventListener('click', closeModal);
  setTimeout(closeModal, 1000);
};

function catModal(response) {
  if (typeof (response) === 'string') {
    document.querySelector('.modal-content').style['align-items'] = 'flex-end';
    document.querySelector('.modal-content').innerHTML = `
      <h1>${response}</h1>
    `;
    setTimeout(closeModal, 3000);
  } else {
    document.querySelector('.modal-content').style['align-items'] = 'flex-end';
    document.querySelector('.modal-content').innerHTML = `    
      <span id="x">&times</span>     
      <img src="${response.file}" style="object-fit: contain; width: 100%; height: 95%">          
    `;
    document.getElementById('x').addEventListener('click', closeModal);
  };
  document.getElementById('modal').style.display = 'block';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.querySelector('.modal-content').style['align-items'] = 'center';
  document.getElementById('amount').focus();
}

document.getElementById('amount').addEventListener('keydown', function (e) {
  if (e.which === 69) {
    e.preventDefault();
  }
})
document.getElementById('interest').addEventListener('keydown', function (e) {
  if (e.which === 69) {
    e.preventDefault();
  }
})
document.getElementById('years').addEventListener('keydown', function (e) {
  if (e.which === 69 || e.key === ".") {
    e.preventDefault();
  }
})
Store.getInquiries();