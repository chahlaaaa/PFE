// app.js
const { Sequelize } = require('sequelize');
const db = require('./config/db'); // ملف إعدادات قاعدة البيانات
const { Course } = require('./models/cours');
const { Student } = require('./models/student');
const { Teacher } = require('./models/teacher');

async function main() {
  try {
    // التحقق من الاتصال
    await db.authenticate();
    console.log('Database connected!');

    // مزامنة كل النماذج
    await db.sync({ alter: true });
    console.log('All models synced!');

    // ========================
    // مثال: إضافة بيانات
    // ========================
    const mathCourse = await Course.create({
      name: 'Math 101',
      description: 'Basic Mathematics'
    });

    const teacher1 = await Teacher.create({
      name: 'Mr. John Doe',
      email: 'john@example.com'
    });

    const student1 = await Student.create({
      name: 'Alice',
      email: 'alice@example.com'
    });

    // ربط الطالب بالدورة
    await student1.addCourse(mathCourse); // إذا استخدمت علاقة many-to-many
    await mathCourse.setTeacher(teacher1); // إذا استخدمت belongsTo Teacher

    // ========================
    // مثال: قراءة البيانات
    // ========================
    const courses = await Course.findAll({
      include: [Teacher, Student]
    });
    console.log('All courses with relations:', courses.map(c => c.toJSON()));

    // ========================
    // مثال: تعديل بيانات
    // ========================
    mathCourse.description = 'Updated Basic Mathematics';
    await mathCourse.save();
    console.log('Course updated:', mathCourse.toJSON());

    // ========================
    // مثال: حذف بيانات
    // ========================
    // await student1.destroy();
    // console.log('Student deleted:', student1.name);

    const express = require('express');
const app = express();
app.use(express.json());

const adminsRouter = require('./routes/admins');
const staffRouter = require('./routes/staff');
const secretariesRouter = require('./routes/secretaries');
const studentsRouter = require('./routes/students');
const coursesRouter = require('./routes/courses');

app.use('/api/admins', adminsRouter);
app.use('/api/staff', staffRouter);
app.use('/api/secretaries', secretariesRouter);
app.use('/api/students', studentsRouter);
app.use('/api/courses', coursesRouter);
const pointagesRoutes = require("./routes/pointages");
app.use("/pointages", pointagesRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
  } catch (error) {
    console.error('Error:', error);
  }
}

main();