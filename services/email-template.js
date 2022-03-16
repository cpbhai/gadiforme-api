exports.signup = (name) => {
  return {
    subject: "Thanks for Registering with www.gadiforme.com:)",
    body: `
    <p style="color:purple;">Hi ${name},<br>
    Thanks for registering.<br>
    For any query/support,<br>
    Please contact <a href="tel:+918433123810" target="_blank">+918433123810</a> or query@gadiforme.com
  </p>`,
  };
};
