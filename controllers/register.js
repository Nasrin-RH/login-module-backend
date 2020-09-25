const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password, company,designation,contact_no} = req.body;
    if (!email || !name || !password || !company || !designation ||!contact_no) {
      return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
      db.transaction(trx => {
        trx.insert({
          hash: hash,
          email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*')
            .insert({
              email: loginEmail[0],
              name: name,
              company:company,
              designation:designation,
              contact_no:contact_no
            })
            .then(user => {
              res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
      })
      .catch(err => res.status(400).json('unable to register'))
  }
  
  module.exports = {
    handleRegister: handleRegister
  };
  