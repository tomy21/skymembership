function getMaxBirthdate() {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 10); // Usia minimal 10 tahun
  return today.toISOString().split("T")[0];
}

export default getMaxBirthdate;
