const jwt = require('jsonwebtoken');
const { User, Role } = require('../db/models');

exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario en la base
    const user = await User.findOne({
      where: { email },
      include: Role
    });

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Comparar contraseñas directamente (solo si confías en tu base de datos)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Crear payload del token
    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.Role ? user.Role.name : 'student'
    };

    // Firmar el token JWT
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.redirect(`http://localhost:5173/login/success?token=${token}`);
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    if (!users) {
      return res.status(404).json({ message: 'Usuarios no encontrados' });
    }
    res.json(users);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};


exports.home = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Welcome</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #121212;
          color: #e0e0e0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
        }
        h2 {
          color: #90caf9;
          margin-bottom: 2rem;
        }
        a {
          text-decoration: none;
          color: white;
          background-color: #4285F4; /* Google blue */
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: bold;
          transition: background 0.3s ease;
        }
        a:hover {
          background-color: #357ae8;
        }
      </style>
    </head>
    <body>
      <h2>Welcome</h2>
      <a href="/auth/google">Sign in with Google</a>
    </body>
    </html>    
  `);
};

exports.googleCallback = (req, res) => {
  console.log(req.user.token)
  res.redirect(`http://localhost:5173/login/success?token=${req.user.token}`);
}

/*
exports.googleCallback = (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Authentication Success</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #121212;
      color: #e0e0e0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
    }
    h3 {
      color: #90caf9;
      margin-bottom: 0.5rem;
    }
    p {
      margin: 0.5rem 0;
    }
    code {
      display: block;
      background: #1e1e1e;
      color: #80cbc4;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 0.5rem;
      max-width: 100%;
      overflow-x: auto;      
      word-break: break-all; 
      white-space: pre-wrap; 
      box-sizing: border-box;
    }
    .container {
      text-align: center;
      padding: 2rem;
      background: #1a1a1a;
      border-radius: 12px;
      box-shadow: 0 0 15px rgba(0,0,0,0.6);
      width: 90%;
      max-width: 700px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h3>Successfully Authenticated ✅</h3>
    <p>Your JWT:</p>
    <code>${req.user.token}</code>
    <p>You can now use this token in Postman to test protected routes.</p>
  </div>
</body>
</html>
  `);
};
*/
