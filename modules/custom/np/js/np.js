(function ($, Drupal) {
  "use strict";

  Drupal.behaviors.bootstrap_np_settings = {
    attach: function (context) {

      function submitNorthPennContactForm(e) {
        e.preventDefault();
        e.stopPropagation();

        var URL = "https://sp27bn72uk.execute-api.us-east-1.amazonaws.com/v1/contact";

        var nameRegex = /[A-Za-z]{1}[A-Za-z]/;
        if (!nameRegex.test($("#edit-name").val())) {
          alert ("The name field can not be less than 2 characters.");
          return;
        }

        if ($("#edit-mail").val()=="") {
          alert ("Please enter your email address.");
          return;
        }

        var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/;
        if (!emailRegex.test($("#edit-mail").val())) {
          alert ("Please enter a valid email address.");
          return;
        }

        var name = $("#edit-name").val();
        var mail = $("#edit-mail").val();
        var message = $("#edit-message").val();
        var referrer = $("#edit-referrer").val();
        var gRecapResp = $("#g-recaptcha-response").val();
        var dataCapsule = {
          name : name,
          mail : mail,
          message : message,
          referrer : referrer,
          gRecapResp : gRecapResp
        };

        $.ajax({
          type: "POST",
          url : URL,
          dataType: "json",
          crossDomain: "true",
          contentType: "application/json; charset=utf-8",
          data: JSON.stringify(dataCapsule),

          success: function (data) {
            // clear form and show a success message
            if (data == 'MailSent') {
              alert("Thank you for your interest - Email sent!");
              document.getElementById("contact-message-feedback-form").reset();
              grecaptcha.reset();
            } else {
              alert("There was a problem sending the form. Are you a robot?");
              grecaptcha.reset();
            }
          },
          error: function () {
            // show an error message
            alert("There was an error sending your message. Are you a robot?");
          }
        });
      }
      $('#edit-submit-contact-form').on('click', function(e) { 
        submitNorthPennContactForm(e);
      });
    }
  };

})(jQuery, Drupal);
